<template>
    <form action="/" method="post" @submit.prevent="record()" v-if="absenceTarget">
        <div class="list-group list-group-flush">
            <div class="list-group-item d-flex flex-row align-items-center px-0" v-for="periode in periodes" :key="'periode-'+periode.id" :class="{'bg-danger bg-opacity-25' : getDeclarationByPeriode(periode).gta__codage_id === 0}">
                <div class="badge text-bg-secondary rounded-pill border-right border-secondary me-2">{{ getTwoDigit(periode.period_day)}}/{{getTwoDigit(periode.period_month)}}/{{periode.period_year}}</div>
                <select class="form-select mx-1" v-model="getDeclarationByPeriode(periode).gta__codage_id" :disabled="getDeclarationByPeriode(periode).gta__codage_id === 0">
                    <option v-for="codage in codages" :value="codage.id" :key="'codage-'+codage.id">{{codage.nom}}</option>
                </select>
                <button class="mx-1 btn btn-outline-danger" @click.prevent="getDeclarationByPeriode(periode).gta__codage_id = 0" v-if="getDeclarationByPeriode(periode).gta__codage_id > 0"><i class="bi bi-x"></i></button>
                <button class="mx-1 btn btn-outline-secondary" @click.prevent="getDeclarationByPeriode(periode).gta__codage_id = codages[0].id" v-else><i class="bi bi-arrow-counterclockwise"></i></button>
            </div>
        </div>
    
        <div class="my-2">
            <label for="manager" class="form-label">Demander la validation à</label>
            <select name="manager" id="manager" class="form-select" v-model="absenceTarget.validation_personne_id" required>
                <option v-for="manager in openedPersonnelManagers" :key="manager.id" :value="manager.id"> {{manager.cache_nom}} </option>
            </select>
        </div>
    
        <div class="my-2">
            <label for="commentaire" class="form-label">Commentaire</label>
            <textarea name="commentaire" id="commentaire" rows="6" class="form-control" v-model="absenceTarget.commentaire"></textarea>
        </div>

        <div class="d-flex justify-content-end my-2">
            <button type="submit" class="btn btn-primary" :disabled="pending">Valider <i class="bi bi-check"></i></button>
            <button type="button" class="btn btn-secondary ms-2" @click.prevent="$emit('cancel')" v-if="cancelButton">Annuler</button>
        </div>
    </form>
</template>

<script>
import { mapState } from 'vuex';
export default {

    props: {
        periodes: Array,
        declarations: Array,
        codages: Array,
        absence: Object,
        cancelButton: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            absenceTarget: null,
            declarationsTarget: [],
            pending: false
        }
    },

    computed: {
        ...mapState(['openedElement', 'openedPersonnelManagers'])
    },

    emits: ['recorded', 'cancel'],

    methods: {
        /**
         * Pour afficher les jours et mois avec deux chiffres
         * @param {Number} number 
         */
        getTwoDigit(number) {
            let nb;
            if (number.toString().length < 2 )
            {
                nb = '0'+number;
            }
            else 
            {
                nb = number;
            }
            return nb;
        },

        /**
         * Lors de l'enregistrement, on doit créer deux tableaux :
         * - Pour les periodes
         * - Pour les codages utilisés pour chaque période
         */
        record() {
            let declarations = [];
            let codages = [];

            this.pending = true;

            this.declarationsTarget.forEach((declaration) => {
                declarations.push(declaration.id);
                codages.push(declaration.gta__codage_id);
            });

            this.$app.apiPost('structurePersonnel/POST/'+this.openedElement.id+'/absence/'+this.absence.id, {
                absence_commentaire: this.absenceTarget.commentaire,
                absence_nx: this.absenceTarget.validation_personne_id,
                declaration_id: declarations.join(','),
                codage_id: codages.join(','),
                notifier: 1,
                delete_zero_codage: true
            })
            .then((data) => {
                this.$emit('recorded', data);
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending = false;
            });
        },

        /**
         * Retourne les informations déclarées pour une période.
         * Si rien est trouvé dans les déclarations déjà enregistrées, alors on crée une déclaration vide.
         * @param {Object} periode Un objet GtaPeriode
         * 
         * @returns {Object}
         */
        getDeclarationByPeriode(periode) {
            let declaration = this.declarationsTarget.find((d) => d.gta__periode_id === periode.id);

            if (!declaration) {
                declaration = {
                    gta__periode_id: periode.id
                };
            }

            return declaration;
        }
    },

    mounted() {
        // Création d'une copie de l'absence à modifier
        this.absenceTarget = JSON.parse(JSON.stringify(this.absence));

        // Création d'une copie des déclarations
        this.declarations.forEach((declaration) => {
            this.declarationsTarget.push(JSON.parse(JSON.stringify(declaration)));
        });
    }

}
</script>
