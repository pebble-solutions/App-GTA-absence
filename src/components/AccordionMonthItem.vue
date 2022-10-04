<template>
    <h3 class="accordion-header" :id="'panelMonth-heading'+month.getTime()">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelMonth-collapse'+month.getTime()" aria-expanded="false" :aria-controls="'panelMonth-collapse'+month.getTime()">
            <span class="badge me-2" :class="classByQt(absencesOpenedSum, 'bg-warning', 'bg-light text-muted')"><i class="bi bi-question"></i> {{absencesOpenedSum}}</span>
            <span class="badge me-2" :class="classByQt(absencesApprouvedSum, 'bg-success', 'bg-light text-muted')"><i class="bi bi-check-lg"></i> {{absencesApprouvedSum}}</span>
            <span class="badge me-2" :class="classByQt(absencesRefusedSum, 'bg-danger', 'bg-light text-muted')"><i class="bi bi-x"></i> {{absencesRefusedSum}}</span>
            {{monthDictFr[month.getMonth()]}} {{month.getFullYear()}}
        </button>
    </h3>

    <div :id="'panelMonth-collapse'+month.getTime()" class="accordion-collapse collapse" :aria-labelledby="'panelMonth-heading'+month.getTime()">
        <div v-if="absences.length > 0" class="list-group list-group-flush">
            <AbsenceItem :absence="absence" v-for="absence in absences" :key="'absence-'+absence.id" />
        </div>
        <div class="text-muted m-3" v-else><i class="bi bi-x-square me-2"></i> Pas de demande sur ce mois.</div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AbsenceItem from './AbsenceItem.vue';
import sqlDateToIso from '../js/sqlDateToIso';

export default {
    props: {
        month: Date
    },
    data() {
        return {
            monthDictFr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        };
    },
    computed: {
        ...mapState(["openedPersonnelAbsences"]),

        /**
         * Liste les absences sur le mois actif.
         * @return {Array}
         */
        absences() {
            let abs = this.openedPersonnelAbsences.filter(abs => (new Date(sqlDateToIso(abs.dd))).getMonth() == this.month.getMonth());
            return abs;
        },

        /**
         * Retourne le nombre d'absences dont le status valider est à OUI
         * @returns {Number}
         */
        absencesApprouvedSum() {
            return this.absences.filter(a => a.valider === 'OUI').length;
        },

        /**
         * Retourne le nombre d'absences dont le status valider est à NON
         * @returns {Number}
         */
        absencesRefusedSum() {
            return this.absences.filter(a => a.valider === 'NON').length;
        },

        /**
         * Retourne le nombre d'absences dont le status valider n'est pas définit
         * @returns {Number}
         */
        absencesOpenedSum() {
            return this.absences.length - this.absencesApprouvedSum - this.absencesRefusedSum;
        }
    },

    methods: {
        /**
         * Retourne une classe CSS en fonction d'un nombre passé en paramètre
         * 
         * @param {Number} qt Le nombre à analyser
         * @param {String} classTrue La class si le nombre est > 0
         * @param {String} classFalse La class si le nombre est <= 0
         * 
         * @returns {String}
         */
        classByQt(qt, classTrue, classFalse) {
            return qt > 0 ? classTrue : classFalse;
        }
    },  
    
    components: { AbsenceItem }
}
</script>