<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="lead">{{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}</div>
            <span class="badge" :class="badgeStatusClass">{{badgeStatusLabel}}</span>
        </div>

        <div class="list-group my-3">
            <AbsencePeriode :periode="periode" :absence="absence" :declaration="getDeclaration(periode.id)" :codages="codages" v-for="periode in periodes" :key="'periode-'+periode.id" />
        </div>

        <div v-if="manager" class="my-2">
            <strong>Valideur : </strong>
            <span>{{manager.cache_nom}}</span>
        </div>

        <div v-if="absence.commentaire" class="my-2">
            <strong class="d-block">Commentaire demandeur :</strong>
            <div>{{absence.commentaire}}</div>
        </div>

        <div v-if="absence.commentaire_n1" class="my-2">
            <strong class="d-block">Commentaire de la hiérarchie :</strong>
            <div>{{absence.commentaire_n1}}</div>
        </div>

        <div class="d-grid" v-if="editable">
            <button class="btn btn-outline-secondary" @click.prevent="$emit('edit-mode')">Modifier la demande <i class="bi bi-pencil-square"></i></button>
        </div>

        <div v-if="isManager && absence.traiter != 'OUI'" class="my-3">
            <div class="d-flex">
                <button class="w-50 me-1 btn btn-success" @click.prevent="$emit('authorize')" :disabled="absence.valider == 'OUI'">Autoriser</button>
                <button class="w-50 ms-1 btn btn-danger" @click.prevent="$emit('refuse')" :disabled="absence.valider == 'NON'">Refuser</button>
            </div>

            <div class="text-center mt-2 text-secondary" v-if="absence.valider">Le status de validation est déjà renseigné. Une modification annulera les informations 
                déjà enregistées.
            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AbsencePeriode from './AbsencePeriode.vue';

export default {
    props: {
        absence: Object,
        managers: Array,
        periodes: Array,
        codages: Array,
        declarations: Array,
        editable: Boolean
    },

    emits: ['edit-mode', 'authorize', 'refuse'],

    methods: {

        getDeclaration(periodeid) {
            let result = this.declarations.find((d) => d.gta__periode_id === periodeid);
            return result;
        },

        /**
         * Retourne une date au format français standard JJ/MM/AAAA
         * @param {Date|String} date La date à transformer
         * @returns {String}
         */
        formatDateFr(date) {
            let newDate = new Date(date);
            let format = newDate.toLocaleDateString('fr-FR');
            return format;
        }
    },

    computed: {

        ...mapState(['openedElement']),
        ...mapGetters(['primary_personnel']),

        /**
         * Retourne l'objet du responsable
         * @return {Object}
         */
        manager() {
            return this.managers.find(e => e.id == this.absence.validation_personne_id);
        },

        /**
         * Retourne la classe css à utiliser pour l'affichage du badge de status
         * warning pour en attente, success pour validé, danger pour refusé
         * @return {String}
         */
        badgeStatusClass() {
            if (this.absence.valider === null) return 'text-bg-warning';
            else if (this.absence.valider === 'OUI') return 'text-bg-success';
            else return 'text-bg-danger';
        },

        /**
         * Retourne le libellé du status de la demande
         * - En attente
         * - Validé
         * - Refusé
         * @return {String}
         */
        badgeStatusLabel() {
            if (this.absence.valider === null) return 'En attente';
            else if (this.absence.valider === 'OUI') return 'Validé';
            else return 'Refusé';
        },

        /**
         * Vérifie si la personnle connectée est validateur
         * @returns {Boolean}
         */
        isManager() {
            if (this.absence.validation_personne_id == this.primary_personnel.id) return true;
            else return false;
        }
    },

    components: { AbsencePeriode }
}

</script>