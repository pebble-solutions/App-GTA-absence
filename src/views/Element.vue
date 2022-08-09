<template>
<div>
    
    {{s}}
</div>
    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <h1>{{openedElement.cache_nom}}</h1>
        <p>{{openedElement.oPersonne.prenom}}</p>
        <div>{{openedElement.id}}</div>
        <pre>{{openedElement}}</pre>
        <div class="container">
            <div class="card shadow-sm mt-4">
                <div class=" card-body">
                    <h2 class="mb-3">Nouvelle demande d'absence</h2>
                    <div class="row mb-3">
                        <div class="col">
                            <label for="dd" class="form-label col">Définissez votre période:</label>
                            <div>
                                <span></span>
                            </div>
                            <input type="date" class="form-control" id="dd">
                        </div>
                    </div>
                    <div class="col-3 m-2">
                        <input class="form-control btn btn-primary" type="submit" value="Créez">
                    </div>
                </div>
            </div>
        </div>
        
        <router-view></router-view>
    </div>
</template>

<script>

import {mapState} from 'vuex'

export default {

    data() {
        return {
            pending: {
                extended: true
            },
            error: null
        }
    },

    computed: {
        ...mapState(['openedElement'])
    },

    methods: {
        /**
         * Charge un élément depuis le store dans openedElement.
         * Si les données étendues ne sont pas chargées, envoie une demande à l'API afin 
         * de s'assurer d'avoir l'ensemble des sous-objets
         * @param {Integer} id
         */
        load(id) {
            this.pending.extended;
            this.$store.dispatch('load', id);
            if (!this.openedElement.extendedData) {
                this.$app.loadExtended(this, this.openedElement).then((data) => {
                    data.extendedData = true;
                    this.$store.dispatch('refreshOpened', data);
                }).catch((error) => {
                    this.error = this.$app.catchError(error, {
                        mode : 'message'
                    })
                });
            }
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        this.load(to.params.id);
    },


    /**
     * Lorsqu'on quite la route active, l'élément ouvert est vidé.
     */
    beforeRouteLeave(from, to, next) {
        this.$store.dispatch('unload');
        next();
    },


    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    mounted() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.load(this.$route.params.id);
    }
}

</script>
