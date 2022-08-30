<template>
    <div class="card mb-3">
        <div class="card-body">

            <div class="d-flex align-items-center justify-content-between">
                <h3 class="card-title">Mes informations</h3>
                <span class="text-secondary">Du {{formatDateFr(period.period_start_date)}} au {{formatDateFr(period.period_end_date)}}</span>
            </div>
            
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div class="col">
                    <div class="card">
                        <div class="card-header">Demandes d'absence</div>
                        <div class="list-group list-group-flush">
                            <div class="d-flex justify-content-between list-group-item">
                                <span class="col-4 text-center text-warning">{{(selectedStats.total - selectedStats.approuved - selectedStats.refused)}}<br>En attente</span>
                                <span class="col-4 text-center text-success" >{{selectedStats.approuved}}<br>Validées</span>
                                <span class="col-4 text-center text-danger">{{selectedStats.refused}}<br>Refusées</span>
                            </div>

                            <div class="list-group-item">
                                <PersonalAbsenceGraph :stats="selectedStats" />
                            </div>

                            <router-link :to="'personnel/'+primary_personnel.id" v-slot="{href, navigate}" custom>
                                <a class="list-group-item text-center text-primary" :href="href" @click="navigate">Toutes mes demandes<i class="bi bi-arrow-up-right ms-2"></i></a>
                            </router-link>

                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">

                        <CounterTable :stats="selectedStats.per_gta_declaration" v-if="displayMode == 'table'" />
                        <CounterGraph :stats="selectedStats.per_gta_declaration" :personnel="primary_personnel" v-if="displayMode == 'chart' && primary_personnel" />
                        
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>
<script>

import {mapGetters} from 'vuex';
import CounterTable from './CounterTable.vue';
import CounterGraph from './CounterGraph.vue';
import PersonalAbsenceGraph from './PersonalAbsenceGraph.vue';
import formatDateFr from '../js/formatDateFr';

export default {

    props: {
        stats: Object,
        period: {
            type:Object,
            default: () => {}
        },
		displayMode: {
			type: String,
			default: 'table'
		}
    },

    data() {
        return {
        
            graphMode: false,
            manager: true,
            selectedPeriod: null
            
        };
    },
    computed: {
        ...mapGetters(["primary_personnel"]),

        /**
         * Retourne l'année de la période sélectionnée
         * @returns {Number}
         */
        selectedYear() {
            return this.period.year;
        },

        /**
         * Retourne les statistique d'une période
         * @returns {Object}
         */
        selectedStats() {
            let stats = this.stats.per_period[this.selectedYear];
            return stats ? stats : {};
        }
    },
    methods: {
        
        /**
         * Convertie une date SQL en date au format français
         * @param {String} date Date au format YYYY-MM-DD
         */
        formatDateFr(date) {
            return formatDateFr(date);
        }
        
        
    },

    components: { CounterTable, CounterGraph, PersonalAbsenceGraph}
}
</script>
