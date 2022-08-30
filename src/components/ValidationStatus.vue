<template>
    <span class="ms-2" :class="statusClass">{{statusLabel}}</span>
    <i class="bi ms-2" :class="statusIconClass"></i>
</template>

<script>

export default {
    props: {
        absence: Object,
        classPrefix: {
            type: String,
            default: 'text-'
        },
        displayMode: {
            type: String,
            default: 'auto'
        }
    },
    
    computed: {
        /**
         * retourne la classe CSS à appliquer en fonction de la propriété valider
         * de l'absence
         * @returns {String}
         */
        statusClass () {
            let dispClass = this.displayMode == 'icon' ? ' d-none' : ' d-none d-md-block';
            return this.classPrefix+this.getStringFromStatusArray(['success', 'danger', 'warning'])+dispClass;
        },

        /**
         * retourne la classe CSS de l'icon à appliquer en fonction de la propriété valider
         * de l'absence
         * @returns {String}
         */
        statusIconClass () {
            let dispClass = this.displayMode == 'icon' ? ' d-block' : ' d-block d-md-none';
            return 'text-'+this.getStringFromStatusArray(['success', 'danger', 'warning'])+ ' ' + this.getStringFromStatusArray(['bi-check-circle', 'bi-x-circle ', 'bi-circle'])+dispClass;
        },

        /**
         * retourne le libellé du statut en fonction de la propriété valider
         * de l'absence
         * @returns {String}
         */
        statusLabel() {
            return this.getStringFromStatusArray(['Validée', 'Refusée', 'En attente']);
        },
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