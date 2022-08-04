<template>
	<div class="container py-2" v-if="$store.state.login">
		<h1 class="text-center">Gestion des absences</h1>
		<hr>
		

		<div class="row">
			<div class="card my-3">
				<div class="card-body">
					<h3 class="text-center list-group-item m-0">Alertes</h3>
				</div>
				<div class="list-group list-group-flush">
					<a href="#" class="list-group-item list-group-item-action">
						<div><span class="badge bg-secondary fs-6">12</span> demandes en attente validation (perso)</div>
					</a>
					<a href="#" class="list-group-item list-group-item-action">
						<div><span class="badge bg-secondary fs-6">12</span> demandes  à traiter (if n+1)</div>
					</a>
					<a href="#" class="list-group-item list-group-item-action">
						<div><span class="badge bg-secondary fs-6">12</span> demandes à traiter (if RH)</div>
					</a>
				</div>
			</div>

			<div class="card">
				<h3 class="list-group-item text-center">Compteurs</h3>

				

					
				<div class="card-group">
					<div class="card">
						<p class="card-header">Matricule</p>
						<div class="list-group list-group-flush">
							<div class="list-group-item">congés acquis: X</div>
							<div class="list-group-item">congés pris: Y</div>
							<div class="list-group-item">SOLDE: Z</div>
						</div>
					</div>
					<div class="card">
						<p class="card-header">Matricule</p>
						<div class="list-group list-group-flush">
							<div class="list-group-item">congés acquis</div>
							<div class="list-group-item">congés pris</div>
							<div class="list-group-item">SOLDE</div>
						</div>
					</div>
					<div class="card">
						<p class="card-header">Matricule</p>
						<div class="list-group list-group-flush">
							<div class="list-group-item">congés acquis</div>
							<div class="list-group-item">congés pris</div>
							<div class="list-group-item">SOLDE</div>
						</div>
					</div>
					<div class="card">
						<p class="card-header">Matricule</p>
						<div class="list-group list-group-flush">
							<div class="list-group-item">CP acquis</div>
							<div class="list-group-item">CP pris</div>
							<div class="list-group-item">SOLDE: Z</div>
						</div>
					</div>
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

import {mapState} from 'vuex';

export default {
	name: 'Home',

	data() {
		return {
			pending: {
				element: false
			}
		}
	},

	computed: {
		...mapState(['tmpElement'])
	},

	methods: {
		/**
		 * Enregistre un nouvel élément.
		 * Étape 1 : appel la fonction record
		 * Étape 2 : enregistre la modification dans le store
		 * Étape 3 : redirige la route vers le nouvel élément
		 */
		recordNew() {
			this.$app.record(this, this.tmpElement, {
				id: 0,
				pending: this.pending.element
			}).then((data) => {
				console.log(data);
				this.$store.dispatch('refreshElements', {
					elements: [data]
				});
				this.$router.push('/element/'+data.id);
			}).catch(this.$app.catchError);
		}
	},

	mounted() {
		this.$store.commit('tmpElement', {
			name: '',
			description: ''
		});
	}
}
</script>
