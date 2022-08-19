<template>
    <table  class="table table-fluid">
        <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Acquis</th>
                <th scope="col">Pris</th>
                <th scope="col">Solde</th>
            </tr>
        </thead>
        <tbody>
            <tr  v-for="counter in counters" :key="'counter-row-'+counter.id" :class="className(counter)">
                <th  scope="row">{{counter.label}}</th>
                <td class="text-center">{{counter.acquis}}</td>
                <td class="text-center">{{counter.pris}}</td>
                <td class="text-center">{{counter.solde}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {

    props: {
        counters: Array
    },

    methods: {
        /**
         * retourne la classe à appliquer sur une ligne en fonction du libellé du compteur
         * la ligne dont le libellé est Total sera affiché en Text-primary
         * les autres en text-secondary
         * 
         * @param {Object} counter le compteur a analyser
         * 
         * @returns {String}
         */
        className(counter){
            return counter.label == 'Total' ? 'text-primary' : 'text-secondary';
        }
    }
}
</script>