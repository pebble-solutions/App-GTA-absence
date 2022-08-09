<template>
	<div class="container py-2" v-if="$store.state.login">
		<h1 class="text-center">Gestion des absences</h1>
		<hr>
		

		<div class="row">
			<div class="card mb-3">
				<h3 class="card-header">Mes infos</h3>
				<div class="card-body">
					<div class="card-group">
						<div class="card">
							<div class="card-header">En cours</div>
							<div class="list-group list-group-flush">
								<div class="d-flex justify-content-between list-group-item">
									<span>en attente validation (if perso) </span><span class="badge bg-secondary fs-6">2</span>
								</div>
								<div class="d-flex justify-content-between list-group-item">
									<span>en attente décision (if n+1) </span><span class="badge bg-secondary fs-6">6</span>
								</div>
								<div class="d-flex justify-content-between list-group-item">
									<span>en attente traitement (if RH) </span><span class="badge bg-danger fs-6">24</span>
								</div>
							</div>
						</div>
						<div class="card">
							<div class="card-header">Mon compteur</div>

							<div class="list-group list-group-flush">
								<div class="d-flex justify-content-between list-group-item">
									<span>CP acquis </span><span class="badge bg-secondary fs-6">12</span>
								</div>
								<div class="d-flex justify-content-between list-group-item">
									<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
								</div>
								<div class="d-flex justify-content-between list-group-item">
									<span>SOLDE </span><span class="badge bg-secondary fs-6">12</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card mb-3">
				<h3 class="card-header">Mon équipe</h3>

			<div class="card-body">
					<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
						<!-- <div class="card">
							<p class="card-header">Matricule</p>
							<div class="list-group list-group-flush">
								<div class="list-group-item">congés acquis: X</div>
								<div class="list-group-item">congés pris: Y</div>
								<div class="list-group-item">SOLDE: </div>
							</div>
						</div> -->
						<div class="col">
							<div class="card">
								<div class="card-header">Killian</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-danger fs-6">24</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Guillaume</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">12</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">12</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">0</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Sébastien</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">OCT</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Sébastien</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">OCT</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Sébastien</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">OCT</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Sébastien</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">OCT</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="card">
								<div class="card-header">Sébastien</div>
								<div class="list-group list-group-flush">
									<div class="d-flex justify-content-between list-group-item">
										<span>CP acquis </span><span class="badge bg-secondary fs-6">24</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>CP pris </span><span class="badge bg-secondary fs-6">0</span>
									</div>
									<div class="d-flex justify-content-between list-group-item">
										<span>SOLDE </span><span class="badge bg-success fs-6">OCT</span>
									</div>
								</div>
							</div>
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
