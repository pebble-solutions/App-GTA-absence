<template>
    <div class="list-group-item d-flex align-items-center py-1">
        <div class="badge text-bg-secondary rounded-pill border-right border-secondary me-3">{{formatDate(periodeDateSQL) }}</div>
        <div>{{getCodageNom()}}</div>
    </div>
</template>

<script>
import formatDateLong from '../js/formatDateLong.js';

export default {
    props: {
        periode: Object,
        absence: Object,
        declaration: Object,
        codages: Array,
    },

    computed: {
        periodeDateSQL() {
            return `${this.periode.period_year}-${this.getTwoDigit(this.periode.period_month)}-${this.getTwoDigit(this.periode.period_day)}`;
        }
    },

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
         * Permet de trouver l'intitulé codage nom
         * 
         */
        getCodageNom() {
            
            let codage = this.codages.find((codage) => codage.id === this.declaration.gta__codage_id);

            if (codage) {
                return codage.nom;
            }
            else {
                return this.declaration.gta__codage_id;
            }
        },

        formatDate (date) {
            return formatDateLong(date);
        }


    }
}

</script>