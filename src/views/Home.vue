<template>
	<div class="container py-2" v-if="$store.state.login">
		<h1 class="text-center">Gestion des absences</h1>
		<hr>
		<div class="card mb-3">
			<div class="card-body">
				<AbsenceForm />
			</div>
		</div>

		<PersonalInformationCard :counters="personal_counters" :personnel="primary_personnel" :bars="absences_statut"   v-if="primary_personnel" />
		
		<TeamInformationCard :personnels="team" v-if="manager"/>
		
		<div class="card mb-3">
			<div class="card-body">
			<h3 class="card-title mb-2">Mes demandes en attente (mapState)</h3>
				<div class="list-group">
					<div class="list-group-item" v-for="abs in absences" :key="'absence'+abs.id"> {{abs.id}} {{abs.dd}} > {{abs.df}}</div>
				</div>
			</div>
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

import {mapGetters, mapState} from 'vuex';
import AbsenceForm from '../components/AbsenceForm.vue';
import PersonalInformationCard from '../components/PersonalInformationCard.vue';
import TeamInformationCard from '../components/TeamInformationCard.vue';

export default {
	name: 'Home',

	
	data() {
		return {
			// pending: {
            //     extended: true,
            //     absences:true
            // },
			// listAbsences:[]
			
			manager: true,
			absences_statut: 
				[ 
					{ color:'warning', value: 66},
					{ color:'success', value:44},
					{ color:'danger', value:11}
				],

			personal_counters: 
			[
				{
					id:0,
					label: 'CP',
					acquis: 4,
					pris: 0,
					solde:4
				},
				{
					id:1,
					label: 'RTT',
					acquis: 2,
					pris: 10,
					solde:-8
				},
				{
					id:2,
					label: 'Sans solde',
					acquis: 0,
					pris: 4,
					solde:-4
				},
				{
					id:3,
					label: 'Total',
					acquis: 6,
					pris: 14,
					solde:-8
				},
			],

			team:
			[
				{
					id:0,
					nom: 'KOPP',
					prenom: 'Killian',
					demandes: 2,
					counters: [
						{
							
							label: 'CP',
							acquis: 10,
							pris: 25,
							solde:-15
						},
						{
							
							label: 'RTT',
							acquis: 10,
							pris: 25,
							solde:-15
						},
						{
							
							label: 'Sans solde',
							acquis: 0,
							pris: 15,
							solde:-15
						},
						{
							
							label: 'Total',
							acquis: 20,
							pris: 65,
							solde:-45
						},
					]
				},
				{
					id:1,
					nom: 'MODARD',
					prenom: 'Guillaune',
					demandes: 1,
					counters: [
						{
							label: 'CP',
							acquis: 10,
							pris: 5,
							solde: 5
						},
						{
							label: 'RTT',
							acquis: 4,
							pris: 0,
							solde:4
						},
						{
							label: 'Roller',
							acquis: 0,
							pris: 10,
							solde:-10
						},
						{
							label: 'Total',
							acquis: 14,
							pris: 15,
							solde:-1
						},
					],
				},
				{
					id:2,
					nom: 'HÉLIGON',
					prenom: 'Sébastien',
					demandes: 2,
					counters: [
						{
							label: 'CP',
							acquis: 10,
							pris: 0,
							solde: 5
						},
						{
							label: 'Récup',
							acquis: 5,
							pris: 0,
							solde:5
						},
						{
							label: 'Sans solde',
							acquis: 0,
							pris: 0,
							solde:0
						},
						{
							label: 'OCTOBRE',
							acquis: 15,
							pris: 0,
							solde:15
						},
					],
				},
				{
					id:3,
					nom: 'LE BIHAN',
					prenom: 'Cédric',
					demandes: 22,
					counters: [
						{
							label: 'CP',
							acquis: 10,
							pris: 5,
							solde: 5
						},
						{
							label: 'RTT',
							acquis: 4,
							pris: 0,
							solde:4
						},
						{
							label: 'Sans solde',
							acquis: 0,
							pris: 10,
							solde:-10
						},
						{
							label: 'Total',
							acquis: 14,
							pris: 15,
							solde:-1
						},
					],
				},
				{
					id:4,
					nom: 'GAVEAU',
					prenom: 'Ambre',
					demandes: 0,
					counters: [
						{
							label: 'CP',
							acquis: 10,
							pris: 5,
							solde: 5
						},
						{
							label: 'RTT',
							acquis: 4,
							pris: 0,
							solde:4
						},
						{
							label: 'Sans solde',
							acquis: 0,
							pris: 10,
							solde:-10
						},
						{
							label: 'Total',
							acquis: 14,
							pris: 15,
							solde:-1
						},
					],
				},
				{
					id:5,
					nom: 'JOULES',
					prenom: 'Arthur',
					demandes: 0,
					counters: [
						{
							label: 'CP',
							acquis: 10,
							pris: 5,
							solde: 5
						},
						{
							label: 'Récup',
							acquis: 4,
							pris: 0,
							solde:4
						},
						{
							label: 'Sans solde',
							acquis: 0,
							pris: 10,
							solde:-10
						},
						{
							label: 'Total',
							acquis: 14,
							pris: 15,
							solde:-1
						},
					],
				},
				{
					id:6,
					nom: 'LANNION',
					prenom: 'Jules',
					demandes: 1,
					counters: [
						{
							label: 'CP',
							acquis: 12,
							pris: 5,
							solde: 6
						},
						{
							label: 'Évènement familial',
							acquis: 4,
							pris: 0,
							solde:4
						},
						{
							label: 'Sans solde',
							acquis: 0,
							pris: 10,
							solde:-10
						},
						{
							label: 'Total',
							acquis: 14,
							pris: 15,
							solde:-1
						},
					],
				},
			],

		}
	},			
					
				
		
			
	
	computed: {
		...mapState(['OpenedElement','absences','managers']),
		...mapGetters(['primary_personnel'])
	},

	components: { AbsenceForm, PersonalInformationCard, TeamInformationCard },

	methods: {

		// /**
        //  * Ajoute une absence à la liste des absences.
        //  * @param {Object} payload Une absence
        //  */
        // addAbsence(payload) {
        //     this.absences.push(payload);
        // },

        // /**
        //  * Redirige le client vers la vue de modification de l'absence
        //  * @param {Object} absence Un objet représentant une absence
        //  */
        // routeToAbsenceConfig(absence) {
        //     this.$router.push('/personnel/'+this.openedElement.id+'/absence_details/'+absence.id+'/edit');
        // }
		/**
		 * Enregistre un nouvel élément.
		 * Étape 1 : appel la fonction record
		 * Étape 2 : enregistre la modification dans le store
		 * Étape 3 : redirige la route vers le nouvel élément
		 */
		// recordNew() {
		// 	this.$app.record(this, this.tmpElement, {
		// 		id: 0,
		// 		pending: this.pending.element
		// 	}).then((data) => {
		// 		console.log(data);
		// 		this.$store.dispatch('refreshElements', {
		// 			elements: [data]
		// 		});
		// 		this.$router.push('/element/'+data.id);
		// 	}).catch(this.$app.catchError);
		// },
		// load(id) {
        //     this.pending.extended;
        //     this.$store.dispatch('load', id);
        //     /*
        //     if (!this.openedElement.extendedData) {
        //         this.$app.loadExtended(this, this.openedElement).then((data) => {
        //             data.extendedData = true;
        //             this.$store.dispatch('refreshOpened', data);
        //         }).catch((error) => {
        //             this.error = this.$app.catchError(error, {
        //                 mode : 'message'
        //             })
        //         });
        //     }
        //     */
        //     this.loadAbsences(id);
        // },
		// loadAbsences(id) {
        //     let apiUrl = 'structurePersonnel/GET/'+id+'/absence';
        //     this.pending.listAbsences = true;
        //     this.$app.apiGet(apiUrl)
        //     .then( (data) => {
        //         this.absences = data.result;
        //         this.pending.listAbsences = false;
        //     })
        //     .catch(this.$app.catchError);
        // },
	},

	mounted() {
		this.$store.commit('tmpElement', {
			name: '',
			description: ''
			
		});
		console.log(this.absences_statut);
		console.table(this.absences_statut);
	}
}
</script>
