<template>
    <div class="card mb-3" v-if="team.length">
        <div class="card-body">
			<div class=" d-flex justify-content-between align-items-center">	
				<h3 class="card-title">Mon équipe</h3>
            </div>
            <div class="row row-cols-1 row-cols-md-2 row-cols-xxl-3 g-2 mb-3">
                <div v-for="personnel in team" :key="'personnel-'+personnel.id" class="col">
                    <div  class="card">
                        <div class="list-group list-group-flush">
                            <div class="list-group-item bg-light">{{personnel.cache_nom}}</div>
							
							<router-link :to="'personnel/'+personnel.id" v-slot="{href, navigate}" custom>
								<a :href="href" class="list-group-item text-center" :class="pendingClass(personnel.stats)" @click="navigate">{{pendingLabel(personnel.stats)}}</a>
							</router-link>

							<CounterTable :stats="personnel.stats.per_gta_declaration" v-if="displayMode == 'table'" />
							<CounterGraph :stats="personnel.stats.per_gta_declaration" :personnel="personnel" v-if="displayMode == 'chart'" />
							
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
import { mapGetters, mapState } from 'vuex';

export default {

	components: { CounterTable, CounterGraph },

	props: {
		period: Object,
		displayMode: {
			type: String,
			default: 'table'
		}
	},
	
	data() {
		return {
			graphMode: false,
			graphique: false
		}
	},

	computed: {
		...mapState(['elements', 'personnelStats']),
		...mapGetters(['primary_personnel']),

		/**
		 * Retourne la liste du personnel de l'équipe
		 * @returns {Array}
		 */
		team() {
			let personnels = this.elements.filter(e => e.id !== this.primary_personnel.id);

			for (let i=0; i<personnels.length; i++) {
				let stats = this.personnelStats[personnels[i].id];
				if (stats) {
					stats = stats['per_period'][this.period.year];
				}
				
				if (!stats) {
					stats = {};
				}

				personnels[i].stats = stats;
			}

			return personnels ? personnels : [];
		}
	},
	
	methods: {
		/**
         * Utilisation de la librairie pluralize
         */
        pluralize(word, number, inclusive) {
            return pluralize(word, number, inclusive);
        },

		/**
		 * Génére un nom de classe en fonction des statistiques à valider.
		 * - warning : si le nombre d'élément à valider est > 0
		 * - muted : dans les autres cas
		 * @param {Object} stats Statistique à analyser pour générer la classe
		 * @returns {String}
		 */
		pendingClass(stats) {
			let diff = this.pendingSum(stats);
			return diff <= 0 ? 'text-muted' : 'text-warning';
		},

		/**
		 * Génère le libeller du bouton de validation en fonction des statistique à valider
		 * @param {Object} stats Statistique à analyser
		 * @returns {String}
		 */
		pendingLabel(stats) {
			let diff = this.pendingSum(stats);
			return diff <= 0 ? 'Pas de demande en cours' : `${this.pluralize('demande', diff, true)} en cours`;
		},

		/**
		 * Retourne le nombre d'élément restant à valider en fonction des statistique
		 * @param {Object} stats Statistique à analyser
		 * @returns {Number}
		 */
		pendingSum(stats) {
			return stats.total ? (stats.total - stats.approuved - stats.refused) : 0;
		}
	},
}
</script>
