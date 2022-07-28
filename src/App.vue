<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2 d-flex align-items-center" v-if="openedElement">
				<router-link to="/" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-arrow-left"></i>
					</a>
				</router-link>

				<span class="me-2">
					<i class="bi bi-person-square me-1"></i>
					{{openedElement.cache_nom}}
				</span>
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-people">Mon personnel</AppMenuItem>
				<AppMenuItem href="/validation" look="dark" icon="bi bi-person-check">Absence à valider</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu v-if="$route.name == 'validation'">
				<ValidationItem v-for="absence in absences" :key="'absence-item-'+absence.id" :absence="absence"></ValidationItem>
			</AppMenu>
			<AppMenu v-else>
				<AppMenuItem :href="'/personnel/'+el.id" v-for="el in elements" :key="el.id" icon="bi bi-person-square">{{el.cache_nom}}<span class="badge bg-secondary float-end"> {{el.matricule}} </span> </AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view :cfg="cfg" v-if="isConnectedUser" />
			</div>
		</template>

	</AppWrapper>
	
</template>
<style>
.fs-7 {
	font-size : 0.9rem;
}

.fs-8 {
	font-size : 0.8rem;
}

.fs-9 {
font-size: 0.7rem;
}
</style>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

import CONFIG from "@/config.json"
import ValidationItem from './components/ValidationItem.vue'

export default {

	inheritAttrs: false,

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true
			},
			isConnectedUser: false
		
		}
	},

	computed: {
		...mapState(['elements', 'openedElement', 'absences']),
		...mapGetters(['primary_personnel'])
	},

	watch: {
		$route(to,from) {
			this.$app.dispatchEvent('menuChanged', 'list');
			if(to.name !== from.name && to.name == "validation"){
				this.$app.apiGet(`structurePersonnel/GET/${this.primary_personnel.id}/validation`)
				.then ((data) => {
					this.$store.commit('absences', data);
				})
				.catch (this.$app.catchError)
			}
		}
	},

	methods: {
		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * @param {Object} user Un objet LocalUser
		 */
		setLocal_user(user) {
			if (user) {
				this.$store.dispatch('login', user);
				this.isConnectedUser = true;
			}
			else {
				this.$store.dispatch('logout');
				this.isConnectedUser = false;
			}
		},

		/**
		 * Envoie une requête pour lister les éléments et les stocke dans le store
		 * 
		 * @param {String} action 'update' (défaut), 'replace', 'remove'
		 * 
		 * @returns {Promise}
		 */
		listElements(action) {
			action = typeof action === 'undefined' ? 'update' : action;

			return this.$app.apiGet('structurePersonnel/GET/listByLogin', {
				nx: true
			})
			.then((data) => {
				this.$store.dispatch('refreshElements', {
					action,
					elements: data
				});
			})
			.catch(this.$app.catchError);
		},

		/**
		 * Change de structure, vide le store
		 * 
		 * @param {Integer} structureId
		 */
		switchStructure(structureId) {
			if(structureId) {

				this.$store.dispatch('switchStructure', structureId);

				this.listElements()
				.then(() => {
					/* La variable primary_personnel est stockée au niveau du store.
					 * Elle est dynamique et n'est renseignée que si le primary_personnel_id existe 
					 * dans la table des personnels stockés au niveau du store. Conditions à remplir :
					 * - L'utilisateur connecté a un primary_personnel_id
					 * - L'utilisateur est connecté à la structure de rattachement de son primary_personnel
					 */
					if (this.primary_personnel) {
						this.$router.push('/personnel/'+this.primary_personnel.id);
					}
					else {
						this.$router.push('/');
					}
				});
			}
		},

		...mapActions(['closeElement'])
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		ValidationItem
	},

	mounted() {
		this.$router.push('/');
		
		this.$app.addEventListener('structureChanged', (structureId) => {
			this.switchStructure(structureId);
		});

	}

}
</script>