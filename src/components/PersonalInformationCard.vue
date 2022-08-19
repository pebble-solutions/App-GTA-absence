<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="d-flex flex-wrap  justify-content-between align-items-center mb-2">
                <h3 class="card-title">Mes informations</h3>
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Année 2022
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">2021</a></li>
                        <li><a class="dropdown-item" href="#">2020</a></li>
                    </ul>
                </div>
                <div class="form-check form-switch form-check-reverse">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Graphiques</label>
                    <input class="form-check-input" type="checkbox" role="switch" id="switchGraphique" @click="graphMode = !graphMode">
                </div>
            </div>
            
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div class="col">
                    <div class="card">
                        <div class="card-header">Demandes d'absence</div>
                        <div class="list-group list-group-flush">
                            <a class="list-group-item text-center text-primary" href="#">Toutes mes demandes<i class="bi bi-arrow-up-right ms-2"></i></a>
                            <div class="d-flex justify-content-between list-group-item">
                                <span class="col-4 text-center text-warning">en attente</span>
                                <span class="col-4 text-center text-success" >validées</span>
                                <span class="col-4 text-center text-danger">refusées</span>
                            </div>
                            <div id="progressBar" class="list-group-item" v-show="!graphMode">
                                
                                <StackedBar :bars="bars" :value="true"/>

                            </div>

                            <PersonalAbsenceGraph v-if="graphMode" />

                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">

                        <CounterTable :counters="counters" v-show="!graphMode" />
                        <CounterGraph :counters="counters" :personnel="personnel" v-if="graphMode" />
                        
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>
<script>

import {mapState} from 'vuex';
// import {GoogleCharts} from 'google-charts';
import pluralize from 'pluralize';
import CounterTable from './CounterTable.vue';
import CounterGraph from './CounterGraph.vue';
import StackedBar from './StackedBar.vue';
import PersonalAbsenceGraph from './PersonalAbsenceGraph.vue';

export default {

    props: {
        counters: Array,
        personnel: Object,
        
        bars: Array,
        percentage: {
            type: Boolean,
            default: false
        },
    },

    data() {
        return {
        
            graphMode: false,
            manager: true,
            
        };
    },
    computed: {
        ...mapState(["OpenedElement", "absences", "managers"])
    },
    methods: {

        
        /**
         * Utilisation de la librairie pluralize
         */
        pluralize(word, number, inclusive) {
            return pluralize(word, number, inclusive);
        },
        /**
         * affiche le google chart piechart avec les données fournies
         */
        
        
    },
    mounted() {
        this.$store.commit("tmpElement", {
            name: "",
            description: ""
        });

        // GoogleCharts.load(this.pieChart);
        // this.chartResize();

        // window.addEventListener("resize", () => {
        //         this.pieChart();
        //     });
    
    },
    components: { CounterTable, CounterGraph, StackedBar, PersonalAbsenceGraph}
}
</script>
