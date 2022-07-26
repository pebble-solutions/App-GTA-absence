<template>
    <span :class="statusClass">{{statusLabel}}</span>
</template>

<script>

export default {
    props: {
        absence: Object,
        classPrefix: {
            type: String,
            default: 'text-'
        }
    },
    
    computed: {
        /**
         * retourne la classe CSS à appliquer en fonction de la propriété valider
         * de l'absence
         * @returns {String}
         */
        statusClass () {
            return this.classPrefix+this.getStringFromStatusArray(['success', 'danger', 'warning']);
        },

        /**
         * retourne le libellé du statut en fonction de la propriété valider
         * de l'absence
         * @returns {String}
         */
        statusLabel() {
            return this.getStringFromStatusArray(['Validée', 'Refusée', 'En attente']);
        }
    },

    methods: {
        /**
         * retourne le statut de l'absence depuis un dictionnaire en fonction 
         * de la propriété valider
         * 
         * @param {Array} dict list des termes à retourner: clé 0 = validée, 1 = refusée, 2 = en attente
         * 
         * @returns {String}
         */
        getStringFromStatusArray (dict) {
            if (this.absence.valider === 'OUI') return dict[0];
            else if (this.absence.valider === 'NON') return dict[1];
            else return dict[2];
        }
    }
}
</script>