<template>
    <div class="progress my-2" style="height:30px">
        <div v-for="(bar,index) in bars" :key="'bar'+ index" 
            class="progress-bar" :class="'bg-'+bar.color"
            role="progressbar"
            aria-valuemax="100" aria-valuemin="0" :aria-valuenow="bar.value"
            :style="'width:'+bar.value+'%'">
            <span v-if="percentage">{{bar.value}}%</span>
            <span v-if="value">{{bar.value /11}}</span>
        </div>
    </div>
</template>

<script>
/**
 *  props :
 * - bar {Array} :
 * {
 *      color:          Couleur de boostrap 
 *      value:          Valeur en % de la bar
 * }
 *        
 */
export default {
    props: {
        bars: Array,
        percentage: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
    },
}
</script>