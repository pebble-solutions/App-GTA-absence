<template>
    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <div class="container">
        <h1 class="d-flex flex-row align-items-baseline justify-content-between py-2">Absences {{openedElement.cache_nom}} <span title="matricule" class="fs-5 badge bg-secondary">{{openedElement.matricule}} </span></h1>

            <div class="row">
                    <!--
                    <div class="card">
                        <div class="list-group list-group-flush">
                            <router-link :to="{name: 'ListAbsence', params: {id: openedElement.id}}" custom v-slot="{navigate, href}">
                                <a @click="navigate" :href="href" class="list-group-item list-group-item-action text-center text-primary">
                                    <div class="lead">20 demandes d'absences</div>
                                </a>
                            </router-link>
                            <router-link :to="{name: 'ListAbsence', params: {id: openedElement.id}}" custom v-slot="{navigate, href}">
                                <a @click="navigate" :href="href" class="list-group-item list-group-item-action text-center bg-warning">
                                    <div class="lead">8 en attente validation</div>
                                </a>
                            </router-link>
                        </div>
                    </div>
                    -->

                    <div v-if="openedElement.primary === true" class="card">
                        <form class="card-body" @submit.prevent="createPeriode()" method="post" action="/">
                            <h2 class="mb-3">Nouvelle demande d'absence</h2>
                            <div class="row">
                                <div class="col-4">
                                    <label for="dd" class="form-label">Date début</label>
                                    <Datepicker  v-model="datePeriodeAbsence.dd"  id="dd" autoApply :minDate="new Date()" :enableTimePicker="false"></Datepicker><!-- :format="format"  -->
                                </div>
                                <div class="col-4">
                                    <label for="df" class="form-label">Date de fin</label>
                                    <Datepicker  v-model="datePeriodeAbsence.df" id="df" autoApply :minDate="datePeriodeAbsence.dd" :enableTimePicker="false"></Datepicker><!-- :format="format"  -->
                                </div>
                                <div  class="col-4">
                                    <label for="" class="form-label">&nbsp;</label>
                                    <button class="form-control btn btn-outline-primary" type="submit" :disabled="pending.creation">
                                        <span>Créer</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card my-2">
                        <div class="list-group list-group-flush">
                            <AbsenceItem :absence="absence" v-for="absence in absences" :key="'absence-'+absence.id" />
                        </div>
                    </div>
            </div>
        </div>

        <router-view 
            :codages="codages" 
            :periodesAbsence="periodesAbsence" 
            :managers="managers" 
            :absences="absences"></router-view>
    </div>
</template>

<script>

import {mapState} from 'vuex';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import AbsenceItem from '../components/AbsenceItem.vue';

export default {

    data() {
        return {
            periodesAbsence: [],
            pending: {
                extended: true,
                creation:false
            },
            error: null,
            datePeriodeAbsence: {
                dd: ref(new Date()),
                df: ref()
            },
            codages: [],

            managers:[],
            absence : null,
            absences: []
        }
    },

    
    computed: {
        ...mapState(['openedElement'])
    },
    watch: {
        
    },
    components: {
    Datepicker,
    AbsenceItem
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
            this.loadAbsence(id);
        },

        getTwoDigit(number) {
            let nb;
            if (number.toString().length < 2 )
            {
                nb = '0'+number;
            }
            else 
            {
                nb = number;
            }
            return nb;
        },



        createPeriode() {
            let apiUrl = 'structurePersonnel/POST/'+this.openedElement.id+'/absence';
 
            let datedd = new Date(this.datePeriodeAbsence.dd);
            let dd = datedd.getFullYear()+'-'+this.getTwoDigit(datedd.getMonth()+1)+'-'+this.getTwoDigit(datedd.getDate());
            let datedf = new Date(this.datePeriodeAbsence.df);
            let df = datedf.getFullYear()+'-'+this.getTwoDigit(datedf.getMonth()+1)+'-'+this.getTwoDigit(datedf.getDate());

            this.pending.creation = true;


            this.$app.apiPost(apiUrl, {
                dd:dd,
                df:df
            })
            .then( (data) => {
                this.periodesAbsence = data.periode;
                this.absence = data.absence[0];

                this.addAbsence(this.absence);

                let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/absence/'+this.absence.id+'/codage';
                this.$app.apiGet(apiUrl)
                .then((data) => {
                    this.codages = data.result;

                    this.pending.creation = false;

                    this.$router.push('/personnel/'+this.openedElement.id+'/absence_config/'+this.absence.id);
                })
                .catch(this.$app.catchError);
            })
            .catch(this.$app.catchError);
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
        loadAbsence(id) {
            let apiUrl = 'structurePersonnel/GET/'+id+'/absence';
            this.$app.apiGet(apiUrl, {
                //dd: this.semaine.dd,
                //df: this.semaine.df,
                //group_by_personnel: true
            })
            .then( (data) => {
                this.absences = data.result;
            })
            .catch(this.$app.catchError);
        },

        /**
         * Ajoute une absence à la liste des absences.
         * @param {Object} payload Une absence
         */
        addAbsence(payload) {
            this.absences.push(payload);
        }


    },
    beforeRouteUpdate(to) {
        this.load(to.params.id);
    },
    beforeRouteLeave(from, to, next) {
        this.$store.dispatch('unload');
        next();
    },
    mounted() {
        this.load(this.$route.params.id);
        this.listManager();
    }
}
</script>