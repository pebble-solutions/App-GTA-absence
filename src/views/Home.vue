<template>
	<div class="container py-2" v-if="$store.state.login">
		<h1 class="text-center">Gestion des absences</h1>
		<hr>
		

		<div class="row">
			<div class="col">
				<div class="card">
					<div class="card-body">
						<h3 class="text-center list-group-item m-0">Alertes</h3>
					</div>
					<div class="list-group list-group-flush">
						<a href="#" class="list-group-item list-group-item-action text-center">
							<div>En attente validation: X</div>
						</a>
						<a href="#" class="list-group-item list-group-item-action text-center">
							<div> À valider (n+1): Y</div>
						</a>
						<a href="#" class="list-group-item list-group-item-action text-center">
							<div>À traiter (RH/paie): Z</div>
						</a>
					</div>
				</div>
			</div>

			<div class="col">
				<div class="card">
					<div class="card-body">
						<h3 class="text-center list-group-item m-0">Compteurs</h3>
					</div>
					<div class="list-group list-group-flush">
						<div class="list-group-item text-center">congés acquis: X</div>
						<div class="list-group-item text-center">congés pris: Y</div>
						<div class="list-group-item text-center text-primary">SOLDE: Z</div>
						
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
