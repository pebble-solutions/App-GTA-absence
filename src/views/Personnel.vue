<template>
    <div v-if="openedElement">
        <div class="container">
            <div class="alert alert-danger" v-if="error">{{error}}</div>
            <h1 class="d-flex align-items-center justify-content-between py-3">
                <div class="d-flex align-items-center">
                    <UserImage size="user-image-lg" :name="openedElement.cache_nom" class-name="me-2" />
                    {{openedElement.cache_nom}} 
                </div>
                <span title="matricule" class="fs-5 badge bg-secondary">{{openedElement.matricule}}</span>
            </h1>
                    

            <div v-if="openedElement.primary === true" class="card my-3">
                <div class="card-body">
                    <AbsenceForm @add-absence="addAbsence" @absence-recorded="routeToAbsenceConfig"></AbsenceForm>
                </div>
            </div>
            <div class="card my-3">
                <div class="card-body">
                    <h2 class="card-title">Toutes les demandes d'absence</h2>
                    <Spinner v-if="pending.absences"></Spinner>
                    <div v-else-if="!pending.absences && !openedPersonnelAbsences.length">
                        <AlertMessage icon="bi bi-x-square" variant="danger">
                            Pas de demandes d'absence
                        </AlertMessage>
                    </div>
                    <div class="list-group list-group-flush" v-if="!pending.absences">
                        <AbsenceItem :absence="absence" v-for="absence in openedPersonnelAbsences" :key="'absence-'+absence.id" />
                    </div>
                </div>
            </div>
        </div>

        <router-view />
    </div>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import AbsenceItem from '../components/AbsenceItem.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AbsenceForm from '../components/AbsenceForm.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import UserImage from '../components/pebble-ui/UserImage.vue';

export default {
    data() {
        return {
            pending: {
                extended: true,
                absences:true
            },
            error: null,
            codages: []
        }
    },

    
    computed: {
        ...mapState(['openedElement', 'openedPersonnelAbsences', 'openedPersonnelManagers']),
    },

    components: {
    AbsenceItem,
    Spinner,
    AbsenceForm,
    AlertMessage,
    UserImage
},

    methods: {

        ...mapActions(['setOpenedPersonnelAbsences', 'addOpenedPersonnelAbsences', 'unloadPersonnel', 'setOpenedPersonnelManagers']),

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
                this.setOpenedPersonnelManagers(data);
            })
            .catch(this.$app.catchError);
        },
    

        /**
         * Charge les déclarations depuis le serveur
         */
        loadAbsences(personnelId) {
            let apiUrl = 'structurePersonnel/GET/'+personnelId+'/absence';
            this.pending.absences = true;
            this.$app.apiGet(apiUrl)
            .then( (data) => {
                this.setOpenedPersonnelAbsences(data.result);
                this.pending.absences = false;
            })
            .catch(this.$app.catchError);
        },

        /**
         * Ajoute une absence à la liste des absences.
         * @param {Object} absence Une absence
         */
        addAbsence(absence) {
            this.addOpenedPersonnelAbsences([absence])
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
        this.unloadPersonnel();
        next();
    },

    mounted() {
        this.load(this.$route.params.id);
        this.listManager();
    }
}
</script>