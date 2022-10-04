<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2 d-md-flex align-items-center d-none" v-if="openedElement">
				<router-link to="/" custom v-slot="{ navigate, href }">
					<a class="btn btn-dark me-2" :href="href" @click="navigate">
						<i class="bi bi-arrow-left"></i>
					</a>
				</router-link>

				<span class="me-2 d-flex align-items-center">
					<UserImage size="user-image-sm" :name="openedElement.cache_nom" className="me-2" />
					<span>{{openedElement.cache_nom}}</span>
				</span>
			</div>

			<div v-if="$route.path.match(/^\/validation/)" class="mx-2 d-none d-md-flex">
				<i class="mx-2 bi bi-person-check"></i>
				Demandes à valider
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem :href="'/personnel/'+primary_personnel.id" look="dark" v-if="primary_personnel">
					<div class="d-flex align-items-center">
						<span><UserImage size="user-image-sm" :name="primary_personnel.cache_nom" /></span>
						<span class="ms-2">{{primary_personnel.cache_nom}}</span>
					</div>
				</AppMenuItem>
				<AppMenuItem href="/" look="dark" icon="bi bi-people">Mon personnel</AppMenuItem>
				<AppMenuItem href="/validation" look="dark" icon="bi bi-person-check">
					Demandes à valider 
					<span class="badge float-end" :class="{'bg-warning': absences.length > 0,'bg-secondary':absences.length == 0}">{{absences.length}}</span> 
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu v-if="$route.name == 'validation'">
				<Spinner v-if="pending.validations" />
				<ValidationItem v-for="absence in absences" :key="'absence-item-'+absence.id" :absence="absence" v-else></ValidationItem>
			</AppMenu>
			<AppMenu v-else>
				<AppMenuItem :href="'/personnel/'+el.id" v-for="el in elements" :key="el.id">
					<div class="d-flex align-items-center justify-content-between">
						<div class="d-flex align-items-center">
							<UserImage size="user-image-sm" :name="el.cache_nom" className="me-2" />
							{{el.cache_nom}} 
							<i class="bi bi-check-lg ms-2" :class="{'text-success': $route.params.id != primary_personnel.id}" v-if="el.id == primary_personnel.id"></i>
						</div>
					</div>
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="bg-light">
				<router-view :cfg="cfg" v-if="isConnectedUser" @refresh="refreshData()" :is-pending="isPending" />
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
import UserImage from './components/pebble-ui/UserImage.vue'
import Spinner from './components/pebble-ui/Spinner.vue'

export default {

	inheritAttrs: false,

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true,
				validations: true
			},
			isConnectedUser: false
		}
	},

	computed: {
		...mapState(['elements', 'openedElement', 'absences']),
		...mapGetters(['primary_personnel']),

		/**
		 * Retourne true si au moins une action est en cours
		 * @returns {Boolean}
		 */
		isPending() {
			for (const key in this.pending) {
				if (this.pending[key]) return true;
			}
			return false;
		}
	},

	watch: {
		$route(to, from) {
			this.$app.dispatchEvent('menuChanged', 'list');

			// La liste des absences à valider est rechargé lorsqu'on passe sur la vue de validation
			if (to.path.match(/^\/validation/) && !from.path.match(/^\/validation/)) {
				this.loadAbsencesValidation();
			}
		},

		primary_personnel() {
			this.loadAbsencesValidation();
		}
	},

	methods: {

		...mapActions(['setPersonnelStats']),

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

			this.pending.elements = true;

			return this.$app.apiGet('structurePersonnel/GET/listByLogin', {
				nx: true
			})
			.then((data) => {
				this.$store.dispatch('refreshElements', {
					action,
					elements: data
				});

				let ids = data.map(e => e['id']);

				return this.$app.apiGet('gtaAbsence/GET/stats/byPersonnel/'+ids.join(','));
			})
			.then((stats) => {
				this.setPersonnelStats(stats);
				this.$app.dispatchEvent("data-refreshed");
			})
			.catch(this.$app.catchError)
			.finally(() => this.pending.elements = false);
		},

		/**
		 * Change de structure, vide le store
		 * 
		 * @param {Integer} structureId
		 */
		switchStructure(structureId) {
			if(structureId) {

				this.$store.dispatch('switchStructure', structureId);

				this.listElements();
			}
		},

		/**
		 * charge les absences à valider si l'utilisateur connecte
		 * est mamager
		 */
		loadAbsencesValidation() {
			if (this.primary_personnel) {
				this.pending.validations = true;
				this.$app.apiGet(`structurePersonnel/GET/${this.primary_personnel.id}/validation`, {
					valider: 'null'
				})
				.then ((data) => {
					this.$store.commit('absences', data);
				})
				.catch (this.$app.catchError)
				.finally(() => this.pending.validations = false);
			}
		},

		/**
		 * Recharge les données depuis le serveur.
		 */
		refreshData() {
			this.listElements()
			.then(() => this.loadAbsencesValidation());
		},

		...mapActions(['closeElement'])
	},

	components: { AppWrapper, AppMenu, AppMenuItem, ValidationItem, UserImage, Spinner },

	mounted() {
		this.$router.push('/');
		
		this.$app.addEventListener('structureChanged', (structureId) => {
			this.switchStructure(structureId);
		});

		this.$app.addEventListener('beforeClearAuth', () => {
			this.$router.push('/');
		});
	}

}
</script>