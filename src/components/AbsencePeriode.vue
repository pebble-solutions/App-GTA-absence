<template>
    <div class="list-group-item d-flex align-items-center py-1">
        <div class="badge text-bg-secondary rounded-pill border-right border-secondary me-3">{{ getTwoDigit(periode.period_day)}}/{{getTwoDigit(periode.period_month)}}/{{periode.period_year}}</div>
        <div>{{getCodageNom()}}</div>
    </div>
</template>

<script>


export default {
    props: {
        periode: Object,
        absence: Object,
        declaration: Object,
        codages: Array,
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
        }


    },

    mounted() {
        // console.log(this.periode);
        // console.log(this.declarations);
        // console.log(this.codages);

    }
}

</script>