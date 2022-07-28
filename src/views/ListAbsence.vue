<template>

    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <h1>Absence #{{openedElement.matricule}} {{openedElement.cache_nom}}</h1>
        <p>{{openedElement.description}}</p>
        <div>structure_personnel_id : {{openedElement.id}}</div>
    </div>

    
        <div class="container">
            <div v-if="!listabsence.valider">
                <h3 class="my-2">Vos demandes d'absences en attente de validation {{openedElement}} </h3>
                <div class="card row">
                    <div  class=" card-body">
                        <div  class ="list-group list-group-flush" v-for="abs in listabsence" :key="'absence'+abs.id">
                            <div class="list-group-item d-flex flex-row align-items-center">
                                <label class="form-label">{{formatDateFr(abs.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(abs.df)}}</label>
                                <label class="form-label">demande du {{formatDateFr(abs.dd)}} à </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        
        <router-view></router-view>

    
    <div class="badge text-success">Hello Leader <i class="bi bi-joystick"></i></div>

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
            let apiUrl = 'structurePersonnel/GET/'+529+'/absence';

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
        formatDateFr(date) {

            let newDate = new Date(date);
            let format = newDate.toLocaleDateString('fr-FR');
            return format;
        }   

    },

    mounted() {

        this.DisplayList();
        console.log('opende',this.openedElement);
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