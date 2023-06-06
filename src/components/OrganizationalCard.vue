<template>
    
    <div class="card m-auto shadow org-chart-personnel" :class="cardClassName">
        <div class="card-body py-1 d-flex align-items-center">

            <div class="me-2">
                <user-image :name="personnel.cache_nom" />
            </div>

            <div>
                <div><strong>{{ personnel.cache_nom }}</strong></div>
                <div v-if="n">{{ nLabel }}</div>
            </div>

        </div>
    </div>

</template>

<style lang="scss" scoped>
.org-chart-personnel {
    max-width: 260px;
}
</style>

<script>
import UserImage from './pebble-ui/UserImage.vue';

export default {

    components: { UserImage },

    props: {
        personnel: Object,
        n: Number,
        me: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        /**
         * Retourne la classe CSS de la card
         * 
         * Si this.me est vrais, la card sera primary.
         * 
         * @return {string}
         */
        cardClassName() {
            return this.me ? 'text-bg-primary' : 'text-bg-light';
        },

        /**
         * Retourne le libellé hiérarchique (N+1, N+2...)
         * 
         * @return {string}
         */
        nLabel() {
            return this.n ? `N+${this.n}` : null;
        }
    }
}

</script>