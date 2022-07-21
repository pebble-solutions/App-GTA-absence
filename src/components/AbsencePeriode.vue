<template>
    <div class="list-group-item d-flex justify-content-between align-items-center">
        <div> {{ getTwoDigit(periode.period_day)}}/{{getTwoDigit(periode.period_month)}}/{{periode.period_year}} </div>
            <div v-if="!absence.valider">
                <select  class="form-select mx-2">
                    <option></option>
                    <option v-for="codage in codages" :key="codage.id" value="codage.nom">{{codage.nom}}</option>
                </select>
            </div>
            <div v-else>
                <p>{{getCodageNom()}}</p>
            </div>
        <!--
        <div class="form-select" v-for="item in codages" :key="item.id">
            <option value="{{item.nom}}"></option>
        </div>
        
        <div v-if="!valider"> 
            <button class="btn btn-outline-danger"><i class="bi bi-x-circle-fill"></i></button>
        </div>
        -->
    </div>
</template>

<script>


export default {
    props: {
        periode: Object,
        declarations: Array,
        codages: Array,
        valider: String,
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
            
            let codage = this.codages.find((codage) => codage.id === this.declarations.gta__codage_id);
            return codage.nom;
        }


    },

    mounted() {
        console.log(this.periode);
        console.log(this.declarations);
        console.log(this.codages);

    }
}

</script>