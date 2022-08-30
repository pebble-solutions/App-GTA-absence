<template>
    <h3 class="accordion-header" :id="'panelMonth-heading'+month">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelMonth-collapse'+month" aria-expanded="false" :aria-controls="'panelMonth-collapse'+month">
            <span class="badge me-2" :class="classByQt(absencesOpenedSum, 'bg-warning', 'bg-light text-muted')"><i class="bi bi-question"></i> {{absencesOpenedSum}}</span>
            <span class="badge me-2" :class="classByQt(absencesApprouvedSum, 'bg-success', 'bg-light text-muted')"><i class="bi bi-check-lg"></i> {{absencesApprouvedSum}}</span>
            <span class="badge me-2" :class="classByQt(absencesRefusedSum, 'bg-danger', 'bg-light text-muted')"><i class="bi bi-x"></i> {{absencesRefusedSum}}</span>
            {{monthDictFr[month-1]}}
        </button>
    </h3>

    <div :id="'panelMonth-collapse'+month" class="accordion-collapse collapse" :aria-labelledby="'panelMonth-heading'+month">
        <div v-if="absences.length > 0" class="list-group list-group-flush">
            <AbsenceItem :absence="absence" v-for="absence in absences" :key="'absence-'+absence.id" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AbsenceItem from './AbsenceItem.vue';

export default {
    props: {
        month: Number
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
            let abs = this.openedPersonnelAbsences.filter(abs => (new Date(abs.dd)).getMonth() + 1 == this.month.toFixed(2));
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