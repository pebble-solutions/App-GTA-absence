<template>
<div class="card" v-if="!manager"></div>
		<div v-else class="card mb-3">
			<div class="card-body">
			<h3 class="card-title">Mon équipe</h3>
			<div class=" d-flex justify-content-end">
					<div class="form-check form-switch form-check-reverse">
						<label class="form-check-label" for="flexSwitchCheckDefault">Compteurs</label>
						<input @click="showGraph2 = !showGraph2" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
					</div>
				</div>
				<div class="row row-cols-1 row-cols-md-2 row-cols-xxl-3 g-2 mb-3">
					<div v-for="pers in team" :key="pers.id" class="col">
						<div  class="card">
							<div class="list-group list-group-flush">
								<div class="list-group-item bg-light">{{pers.nom}} {{pers.prenom}}</div>
								<a v-if="!pers.demandes" class="list-group-item text-center text-muted" href="#">Pas de demande d'absence en cours</a>
								<a v-else class="list-group-item text-center text-warning" href="#">{{pluralize('demande', pers.demandes, true)}} en cours<i class="bi bi-arrow-up-right ms-2"></i></a>
							</div>
							<table  v-show="showGraph2" class="table table-fluid">
								<thead class="">
									<tr>
										<th scope="col">Compteurs</th>
										<th scope="col">Acquis</th>
										<th scope="col">Pris</th>
										<th scope="col">Solde</th>
									</tr>
								</thead>
								<tbody  v-for="obj in pers.compteurs" :key="obj.id">
									<tr v-if="obj.label == 'Total'" class="text-primary">
										<th  scope="row">{{obj.label}}</th>
										<td class="text-center">{{obj.acquis}}</td>
										<td class="text-center">{{obj.pris}}</td>
										<td class="text-center">{{obj.solde}}</td>
									</tr>
									<tr v-else class="text-secondary">
										<th  scope="row">{{obj.label}}</th>
										<td class="text-center">{{obj.acquis}}</td>
										<td class="text-center">{{obj.pris}}</td>
										<td class="text-center">{{obj.solde}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
</template>
<script>

import {GoogleCharts} from 'google-charts';
import pluralize from 'pluralize';

export default {
	

	
	data() {
		return {
			// pending: {
            //     extended: true,
            //     absences:true
            // },
			// listAbsences:[]
			
			//showGraph1: false,
			showGraph2: false,
			manager: true,
			graphique: false,
			
			team: [
				{
					id:0,
					nom: 'KOPP',
					prenom: 'Killian',
					demandes: 2,
					compteurs: [
						{
							id:0,
							label: 'CP',
							acquis: 10,
							pris: 25,
							solde:-15
						},
						{
							id:1,
							label: 'RTT',
							acquis: 10,
							pris: 25,
							solde:-15
						},
						{
							id:2,
							label: 'Sans solde',
							acquis: 0,
							pris: 15,
							solde:-15
						},
						{
							id:3,
							label: 'Total',
							acquis: 20,
							pris: 65,
							solde:-45
						},
					],
				},
				{
					id:1,
					nom: 'MODARD',
					prenom: 'Guillaune',
					demandes: 1,
					compteurs: [
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
					compteurs: [
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
							label: 'Total Oct',
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
					compteurs: [
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
					compteurs: [
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
					compteurs: [
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
					compteurs: [
						{
							label: 'CP',
							acquis: 10,
							pris: 5,
							solde: 5
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
			]
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
		GoogleCharts.load(this.drawVisualization);
		window.addEventListener('resize', () => {
			this.drawVisualization();
		})
	}
}
</script>
