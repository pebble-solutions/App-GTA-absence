<template>
    <div v-if="openedElement">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <h1>Absence #{{openedElement.matricule}} {{openedElement.cache_nom}}</h1>
        <p>{{openedElement.description}}</p>
        <div>structure_personnel_id : {{openedElement.id}}</div>
        <!--<pre>{{openedElement}}</pre>-->
        <div class="container">
            <div class="card shadow-sm mt-4">
                <div class="card-body">
                    <h2 class="mb-3">Tableau de bord</h2>
                    <div class="row">
                        <router-link :to="{name: 'ListAbsence', params: {id: openedElement.id}}" custom v-slot="{navigate, href}">
                            <a @click="navigate" :href="href" class="col">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <p class="card-text">Liste absences</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            
                                        </div>
                                    </div> 
                                </div>
                            </a>
                        </router-link>
                        <a class="col">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <p class="card-text">En attente validation</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        
                                    </div>
                                </div>
                            </div>
                        </a>
                        <a class="col">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <p class="card-text">Soldes</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="card shadow-sm mt-4">
                <div class=" card-body">
                    <h2 class="mb-3">Définissez votre période d'absence</h2>
                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                            <label for="dd" class="form-label col">Date début:</label>
                            <Datepicker  v-model="datePeriodeAbsence.dd"  id="dd" autoApply :format="format" :minDate="new Date()" :enableTimePicker="false"></Datepicker>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="df" class="form-label col">Date de fin:</label>
                            <Datepicker  v-model="datePeriodeAbsence.df" id="df" autoApply :format="format" :minDate="datePeriodeAbsence.dd" :enableTimePicker="false"></Datepicker>
                        </div>
                    </div>
                    <div  class="col-3 m-2">
                        <button @click.prevent="createPeriode()" class="form-control btn btn-outline-primary" type="button">
                            <span>Créez</span>
                           <!--<span v-if="!periodesAbsence" v-else>Modifiez</span>-->
                        </button>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm mt-3 mb-3">
                <div class="card-body">
                    <h2 class="mb-3">Configurez votre demande</h2>
                    <div class ="list-group" v-for="periode in periodesAbsence" :key="'periode-'+periode.id">
                        <div class="list-group-item">
                       <label class="form-label">le {{periode.period_day}} / {{periode.period_month}} / {{periode.period_year}}</label>
                                <select class="form-select">
                                    <option v-for="codage in codages" :key="codage.id">{{codage.nom}}</option>
                                </select>
                        <span class="col-2"><i class="bi bi-trash"></i></span>
                        </div>
                    </div>
                    <div class="card-body bg-light">
                       <label class="form-label">Demandez la validation à</label>

                        <select name="validateur" id="validateur" class="form-select">
                            <option v-for="validateur in validator" :key="validateur.id"> {{validateur.cache_nom}} </option>
                        </select>

                    
                        <button class="form-control btn btn-outline-primary" type="button">
                            <span>Envoyez</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>


        
        <router-view></router-view>
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

            validator:[],
            
            
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
                
                console.log('data codage', data);
                let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/absence/'+data.absence.id+'/codage';
                this.$app.apiGet(apiUrl)
                .then((data) => {
                    console.log('data detail',data);
                    this.codages = data.result;
                })
                .catch(this.$app.catchError);
            })
            // .catch(this.$app.catchError);
            .catch((error) => {
                console.log(error);
            })
        },
        
        ChoiceValidator() {

            let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/nx';
            this.$app.apiGet(apiUrl)
            .then((data) => {
                this.validator = data;
                console.log(data);
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
                //this.absences = data.result;
                console.log(data.result);
                console.log(data)
                //this.gta_codages = data.gta_codages;
                //this.pending.week = false;
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
        this.ChoiceValidator();
    }
}
</script>