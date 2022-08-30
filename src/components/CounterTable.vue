<template>
    <table  class="table table-fluid">
        <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col" class="text-center">Pris</th>
                <th scope="col" class="text-center text-black-50">Refusé</th>
            </tr>
        </thead>
        <tbody>
            <tr  v-for="(item, codage_id) in stats" :key="'counter-row-'+codage_id">
                <th  scope="row">{{item.label}}</th>
                <td class="text-center">{{item.approuved}}</td>
                <td class="text-center text-black-50">{{item.refused}}</td>
            </tr>

            <tr class="text-primary">
                <th  scope="row">Total</th>
                <td class="text-center">{{sum('approuved')}}</td>
                <td class="text-center text-black-50">{{sum('refused')}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {

    props: {
        stats: Object
    },

    methods: {
        /**
         * Retourne la somme d'un compteur
         * 
         * @param {String} counter Compteur à calculer
         * 
         * @returns {Number}
         */
        sum(counter) {
            let sum = 0;
            for (const key in this.stats) {
                sum += this.stats[key][counter];
            }
            return sum;
        }
    }
}
</script>