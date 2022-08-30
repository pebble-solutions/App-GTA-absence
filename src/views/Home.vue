<template>
	<div>
		<HeaderToolbar>
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center">
					<PeriodDropdown @period-change="periodChange" v-if="personnelStats" />
					<div class="form-check form-switch form-check-reverse ms-2" title="Mode graphique">
						<input class="form-check-input" type="checkbox" role="switch" id="chartModeSwitch" v-model="chartMode">
						<label class="form-check-label" for="chartModeSwitch">
							<i class="bi bi-bar-chart"></i>
						</label>
					</div>
				</div>

				<button class="btn btn-light" @click.prevent="$emit('refresh')" title="Actualiser les données" :disabled="isPending">
					<i class="bi bi-arrow-clockwise" v-if="!isPending"></i>
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-else></span>
				</button>
			</div>
		</HeaderToolbar>
		<div class="container py-2" v-if="$store.state.login">
			<div class="card mb-3">
				<div class="card-body">
					<AbsenceForm @absence-recorded="routeToAbsenceConfig"></AbsenceForm>
				</div>
			</div>
	
			<PersonalInformationCard :stats="personnel_stats" :display-mode="displayMode" :period="selectedPeriod" v-if="personnel_stats && selectedPeriod" />
			
			<TeamInformationList :period="selectedPeriod" :display-mode="displayMode" v-if="personnelStats && selectedPeriod" />
			
		</div>
	</div>
</template>

<style lang="scss" scoped>
.logo {
	max-width:360px;
	display:block;
	margin:20px auto;
}
</style>

<script>

import { mapGetters, mapState} from 'vuex';
import AbsenceForm from '../components/AbsenceForm.vue';
import PersonalInformationCard from '../components/PersonalInformationCard.vue';
import TeamInformationList from '../components/TeamInformationList.vue';
import PeriodDropdown from '../components/PeriodDropdown.vue';
import HeaderToolbar from '../components/pebble-ui/toolbar/HeaderToolbar.vue';

export default {
	name: 'Home',

	props: {
		isPending: Boolean
	},
	
	data() {
		return {
			selectedPeriod: null,
			chartMode: false
		}
	},
	
	computed: {
		...mapState(['absences','managers', 'personnelStats']),
		...mapGetters(['primary_personnel']),

		/**
		 * Retourne les statistique du personnel connecté
		 * @returns {Object}
		 */
		personnel_stats() {
			if (this.primary_personnel) {
				return this.getStatsFromPersonnelId(this.primary_personnel.id)
			}
			return null;
		},

		/**
		 * Retourne le mode d'affichage des informations (table ou graphique)
		 * @returns {String}
		 */
		displayMode() {
			return this.chartMode ? 'chart' : 'table';
		}
	},

	components: { AbsenceForm, PersonalInformationCard, TeamInformationList, PeriodDropdown, HeaderToolbar },

	methods: {

		/**
         * Redirige le client vers la vue de modification de l'absence
         * @param {Object} absence Un objet représentant une absence
         */
        routeToAbsenceConfig(absence) {
            this.$router.push('/personnel/'+this.primary_personnel.id+'/absence_details/'+absence.id+'/edit');
        },

		/**
		 * Retourne les statistiques pour un personnel donné en option
		 * @param {Number} personnel_id L'ID du personnel pour lequel on retourne les stats
		 * @returns {Object}
		 */
		getStatsFromPersonnelId(personnel_id) {
			if (this.personnelStats) {
				let stats = this.personnelStats[personnel_id];
				return stats ? stats : {};
			}
			return null;
		},

		/**
		 * Modifie la période sélectionnée pour l'affichage des informations
		 * @param {Object} period Nouvelle période sélectionnée
		 */
		periodChange(period) {
			this.selectedPeriod = period;
		}
	}
}
</script>
