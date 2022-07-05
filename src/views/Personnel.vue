<template>
    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <div class="container">
        <h1 class="d-flex flex-row align-items-baseline justify-content-between my-2">Absences {{openedElement.cache_nom}} <span title="matricule" class="fs-5 badge bg-secondary">{{openedElement.matricule}} </span></h1>

            <div class="row">
                <div class="col-3 card">
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
                <div class="col card">
                    <form class="row card-body" method="post" action="/" @submit.prevent="createPeriode()">
                        <h2 class="mb-3">Nouvelle demande d'absence</h2>
                        <div class="col-4">
                            <label for="dd" class="form-label">Date début</label>
                            <Datepicker  v-model="datePeriodeAbsence.dd"  id="dd" autoApply :format="format" :minDate="new Date()" :enableTimePicker="false"></Datepicker>
                        </div>
                        <div class="col-4">
                            <label for="df" class="form-label">Date de fin</label>
                            <Datepicker  v-model="datePeriodeAbsence.df" id="df" autoApply :format="format" :minDate="datePeriodeAbsence.dd" :enableTimePicker="false"></Datepicker>
                        </div>
                        <div  class="col-4">
                            <label for="" class="form-label">&nbsp;</label>
                            <button class="form-control btn btn-outline-primary" type="submit">
                                <span>Créer</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <router-view :codages="codages" :periodesAbsence="periodesAbsence" :managers="managers"></router-view>
    </div>
</template>

<script>

import {mapState} from 'vuex';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

export default {

    data() {
        return {
            periodesAbsence: [],
            pending: {
                extended: true
            },
            error: null,
            datePeriodeAbsence: {
                dd: ref(new Date()),
                df: ref()
            },
            codages: [],

            managers:[],
            absence : null
            
            
        }
    },

    
    computed: {
        ...mapState(['openedElement'])
    },
    watch: {
        
    },
    components: {
        Datepicker
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


            this.$app.apiPost(apiUrl, {
                dd:dd,
                df:df
            })
            .then( (data) => {
                this.periodesAbsence = data.periode;
                this.absence = data.absence;

                let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/absence/'+data.absence.id+'/codage';
                this.$app.apiGet(apiUrl)
                .then((data) => {
                    this.codages = data.result;

                    this.$router.push('/personnel/'+this.openedElement.id+'/absence_config');
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
                console.log(data.result);
                console.log(data);
            })
            .catch(this.$app.catchError);
        },


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