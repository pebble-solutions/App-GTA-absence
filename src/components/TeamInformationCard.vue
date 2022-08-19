<template>
<div class="card" v-if="!manager"></div>
    <div v-else class="card mb-3">
        <div class="card-body">
			<div class=" d-flex justify-content-between align-items-center">	
				<h3 class="card-title">Mon équipe</h3>
                <div class="form-check form-switch form-check-reverse">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Graphiques</label>
                    <input @click="graphMode = !graphMode" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                </div>
            </div>
            <div class="row row-cols-1 row-cols-md-2 row-cols-xxl-3 g-2 mb-3">
                <div v-for="pers in personnels" :key="'personnel-'+pers.id" class="col">
                    <div  class="card">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item bg-light">{{pers.nom}} {{pers.prenom}}</div>
                            <a v-if="!pers.demandes" class="list-group-item text-center text-muted" href="#">Pas de demande d'absence en cours</a>
                            <a v-else class="list-group-item text-center text-warning" href="#">{{pluralize('demande', pers.demandes, true)}} en cours<i class="bi bi-arrow-up-right ms-2"></i></a>
							
								<CounterTable :counters="pers.counters" v-show="!graphMode" />
								
								<CounterGraph :counters="pers.counters" :personnel="pers" v-show="graphMode" />
							
						</div>
                    </div>
				</div>
            </div>
        </div>
        
		</div>
</template>
<script>

import pluralize from 'pluralize';
import CounterTable from './CounterTable.vue';
import CounterGraph from './CounterGraph.vue';

export default {

	components: { CounterTable, CounterGraph },

	props: {
		personnels: Array
	},
	

	
	data() {
		return {
			// pending: {
            //     extended: true,
            //     absences:true
            // },
			// listAbsences:[]
			
			//showGraph1: false,
			graphMode: false,
			manager: true,
			graphique: false
		}
	},

	
	methods: {
		/**
		
		
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
		this.$store.commit('tmpElement', {
			name: '',
			description: ''
		});
	}
}
</script>
