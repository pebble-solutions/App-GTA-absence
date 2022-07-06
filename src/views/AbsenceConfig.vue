<template>
    <AppModal id="absenceConfig" title="Demande d'absence" :submit-btn="true" :pending="pending" :display="display" @submit="record" size="lg">
        <div class="list-group list-group-flush">
            <div class ="list-group-item d-flex flex-row align-items-baseline" v-for="periode in periodesAbsence" :key="'periode-'+periode.id">
                <label class="mx-1">{{periode.period_day}}/{{periode.period_month}}/{{periode.period_year}}</label>
                <select class="form-select mx-1" v-model="periode.codage_id">
                    <option v-for="codage in codages" :value="codage.id" :key="codage.id">{{codage.nom}}</option>
                </select>
                <button class="mx-1 btn btn-outline-danger"> <span> <i class="bi bi-x-circle-fill"></i></span></button>
            </div>

            <div class="my-2">
                <label for="manager" class="form-label">Demander la validation à</label>
                <select name="manager" id="manager" class="form-select" v-model="absenceTarget.validation_personne_id">
                    <option v-for="manager in managers" :key="manager.id" :value="manager.id"> {{manager.cache_nom}} </option>
                </select>
            </div>

            <div class="my-2">
                <label for="commentaire" class="form-label">Commentaire</label>
                <textarea name="commentaire" id="commentaire" rows="6" class="form-control" v-model="absenceTarget.commentaire"></textarea>
            </div>
        </div>
    </AppModal>
</template>

<script>
import { mapState } from 'vuex';

import AppModal from "../components/pebble-ui/AppModal.vue";

export default {

    props: {
        periodesAbsence: Array,
        codages: Array,
        managers: Array,
        absences: Array
    },

    data() {
        return {
            pending: false,
            absenceTarget: null,
            modal: null
        }
    },

    computed: {
        ...mapState(['openedElement']),

        absence() {
            return this.absences.find(e => e.id == this.$route.params.absenceId);
        }
    },

    components: {
        AppModal
    },

    methods: {
        /**
         * Lors de l'enregistrement, on doit créer deux tableaux :
         * - Pour les periodes
         * - Pour les codages utilisés pour chaque période
         */
        record() {
            let periodes = [];
            let codages = [];

            this.periodesAbsence.forEach((periode) => {
                periodes.push(periode.id);
                codages.push(periode.codage_id);
            });

            this.$app.apiPost('structurePersonnel/POST/'+this.openedElement.id+'/absence/'+this.absence.id, {
                absence_commentaire: this.absenceTarget.commentaire,
                absence_nx: this.absenceTarget.validation_personne_id,
                declaration_id: JSON.stringify(periodes),
                codage_id: JSON.stringify(codages),
                notifier: 1
            })
            .then((data) => {
                this.$emit('absence-created', data);
                this.$router.push('/personnel/'+data.structure__personnel_id);
            })
            .catch(this.$app.catchError);
        }
    },
    
    beforeMount() {
        console.log('absence', this.absence);
        console.log('periode', this.periodesAbsence);

        this.absenceTarget = this.absence;
    },

    mounted() {
        this.modal = document.getElementById('absenceConfigModal');

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.$router.push('/personnel/'+this.openedElement.id);
        });
    }

}

</script>