<template>
    
    <template v-for="(personnel, index) in personnels" :key="personnel.id">
        <organizational-card :personnel="personnel" :me="isMe(personnel)" :n="getNLevel(personnel)" />
        <div v-if="!lastItem(index)" class="org-chart-line border-end"></div>
    </template>

</template>

<style lang="scss" scoped>
.org-chart-line {
    border-right-width: 2px !important;
    width:50%;
    height:20px;

}
</style>

<script>
import OrganizationalCard from './OrganizationalCard.vue'

export default {
    
    components: { OrganizationalCard },

    props: {
        personnels: Array,
        me: Object
    },

    methods: {
        /**
         * Retourne true si le personnel passé en paramètre correspond à me (moi même)
         * 
         * @param {object} personnel Le personnel à tester
         * 
         * @return {bool}
         */
        isMe(personnel) {
            return personnel.id == this.me.id;
        },

        /**
         * Retourne le niveau du personnel testé par rapport à me
         * 
         * @param {object} personnel Le personnel à tester
         * 
         * @return {number}
         */
        getNLevel(personnel) {
            return this.me.niveau_hierarchique - personnel.niveau_hierarchique;
        },


        /**
         * Retourne true si l'index passé est le dernier de la liste du personnel
         * 
         * @param {number} index L'index à analyser
         * 
         * @return {bool}
         */
        lastItem(index) {
            return index + 1 >= this.personnels.length ? true : false;
        }
    }
}
</script>
