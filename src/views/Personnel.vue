<template>
    <div v-if="openedElement">
        <div class="container">
            <div class="alert alert-danger" v-if="error">{{error}}</div>
            <h1 class="d-flex align-items-center justify-content-between py-3">
                {{openedElement.cache_nom}} 
                <span title="matricule" class="fs-5 badge bg-secondary">{{openedElement.matricule}}</span>
            </h1>
                    

            <div v-if="openedElement.primary === true" class="card my-3">
                <div class="card-body">
                    <AbsenceForm @add-absence="addAbsence" @absence-recorded="routeToAbsenceConfig"></AbsenceForm>
                </div>
            </div>
            <div class="card my-3">
                <div class="card-body">
                    <h2 class="mb-3">Toutes les demandes d'absence</h2>
                    <Spinner v-if="pending.absences"></Spinner>
                    <div v-else-if="!pending.absences && !absences.length">
                        <AlertMessage icon="bi bi-x-square" variant="danger">
                            Pas de demandes d'absence
                        </AlertMessage>
                    </div>
                    <div class="list-group list-group-flush" v-if="!pending.absences">
                        <AbsenceItem :absence="absence" v-for="absence in absences" :key="'absence-'+absence.id" />
                    </div>
                </div>
            </div>
        </div>

        <router-view 
            :managers="managers" 
            :absences="absences"></router-view>
    </div>
</template>

<script>

import {mapState} from 'vuex';
import AbsenceItem from '../components/AbsenceItem.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AbsenceForm from '../components/AbsenceForm.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';

export default {
    data() {
        return {
            pending: {
                extended: true,
                absences:true
            },
            error: null,
            codages: [],
            managers:[],
            absences: []
        }
    },

    
    computed: {
        ...mapState(['openedElement']),
    },

    components: {
        AbsenceItem,
        Spinner,
        AbsenceForm,
        AlertMessage
    },

    methods: {

        load(id) {
            this.pending.extended;
            this.$store.dispatch('load', id);
            /*
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
            */
            this.loadAbsences(id);
        },
        

        /**
         * Récupère la liste des managers disponibles pour le personnel en cours
         */
        listManager() {

            let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/nx';
            this.$app.apiGet(apiUrl)
            .then((data) => {
                this.managers = data;
            })
            .catch(this.$app.catchError);
        },
    

        /**
         * Charge les déclarations depuis le serveur
         */
        loadAbsences(id) {
            let apiUrl = 'structurePersonnel/GET/'+id+'/absence';
            this.pending.absences = true;
            this.$app.apiGet(apiUrl)
            .then( (data) => {
                this.absences = data.result;
                this.pending.absences = false;
            })
            .catch(this.$app.catchError);
        },

        /**
         * Ajoute une absence à la liste des absences.
         * @param {Object} payload Une absence
         */
        addAbsence(payload) {
            this.absences.push(payload);
        },

        /**
         * Redirige le client vers la vue de modification de l'absence
         * @param {Object} absence Un objet représentant une absence
         */
        routeToAbsenceConfig(absence) {
            this.$router.push('/personnel/'+this.openedElement.id+'/absence_details/'+absence.id+'/edit');
        }


    },

    beforeRouteUpdate(to, from) {
        if (to.params.id !== from.params.id) {
            this.load(to.params.id);
        }
    },

    beforeRouteLeave(from, to, next) {
        this.$store.dispatch('unload');
        next();
    },

    mounted() {
        this.load(this.$route.params.id);
        this.listManager();
        console.log('managers', this.managers);
        console.log('absences in Personnel', this.absences)
        console.log('absences_validation in personnel', this.absences_validation)
    }
}
</script>