<template>

    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <h1>Absence #{{openedElement.matricule}} {{openedElement.cache_nom}}</h1>
        <p>{{openedElement.description}}</p>
        <div>structure_personnel_id : {{openedElement.id}}</div>
    </div>

    
        <div class="container">
            <div class="card shadow-sm mt-4">
                <div class="card-body">
                    
                </div>
            </div>
            
            <div class="card shadow-sm mt-4">
                <div class=" card-body">
                    <h2 class="mb-3">Vos absences</h2>
                    <div class="card-body">
                        <div class ="list-group" v-for="abs in listabsence" :key="'absence'+abs.id">
                        <div class="list-group-item">
                        <label class="form-label">du {{abs.dd}} au  {{abs.df}}</label>
                        <select class="form-select">
                        </select>
                        <span class="col-2"><i class="bi bi-trash"></i></span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm mt-3 mb-3">
                <div class="card-body">
                </div>
            </div>
        </div>


        
        <router-view></router-view>

    
    <div>Hell world</div>

</template>

<script>

import {mapState} from 'vuex';


export default {

    data() {
        return {
            listabsence: [],
        }
    },

    
    computed: {
        ...mapState(['openedElement'])
    },
    watch: {
        
    },
    components: {
    },
    methods: {
        DisplayList() {
            let apiUrl = 'structurePersonnel/GET/'+457+'/absence';

            this.$app.apiGet(apiUrl)

            .then( (data) => {
            this.listabsence = data.result;
            console.log('data absence', data);
            })
            // .catch(this.$app.catchError);
            .catch((error) => {
            console.log(error);
            })
        },

    },

    mounted() {

        this.DisplayList();
    },

            /**copié dans le modèle
             
            beforeRouteUpdate(to) {
                this.load(to.params.id);
            },
            beforeRouteLeave(from, to, next) {
                this.$store.dispatch('unload');
                next();
            },
            mounted() {
                this.load(this.$route.params.id);
            },
            */
    };






</script>