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

				<span class="me-2 d-flex align-items-center">
					<UserImage size="user-image-sm" :name="openedElement.cache_nom" className="me-2" />
					{{openedElement.cache_nom}}
				</span>
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-people">Mon personnel</AppMenuItem>
				<AppMenuItem href="/validation" look="dark" icon="bi bi-person-check">Demande d'absence à valider <span class="badge float-end" :class="{'bg-warning': absences.length > 0,'bg-secondary':absences.length == 0}">{{absences.length}}</span> </AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu v-if="$route.name == 'validation'">
				<ValidationItem v-for="absence in absences" :key="'absence-item-'+absence.id" :absence="absence"></ValidationItem>
			</AppMenu>
			<AppMenu v-else>
				<AppMenuItem :href="'/personnel/'+el.id" v-for="el in elements" :key="el.id">
					<div class="d-flex align-items-center justify-content-between">
						<div class="d-flex align-items-center">
							<UserImage size="user-image-sm" :name="el.cache_nom" className="me-2" />
							{{el.cache_nom}} 
							<i class="bi bi-check-lg ms-2" :class="{'text-success': $route.params.id != primary_personnel.id}" v-if="el.id == primary_personnel.id"></i>
						</div>
						<span class="badge bg-secondary"> {{el.matricule}} </span> 
					</div>
				</AppMenuItem>
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
import UserImage from './components/pebble-ui/UserImage.vue'

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
		$route() {
			this.$app.dispatchEvent('menuChanged', 'list');
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

				this.listElements();
			}
		},

		/**
		 * charge les absences à valider si l'utilisateur connecte
		 * est mamager
		 */
		loadAbsencesValidation(){
			console.log('load', this.primary_personnel);
			this.$app.apiGet(`structurePersonnel/GET/${this.primary_personnel.id}/validation`, {
				valider: 'null'
			})
			.then ((data) => {
				this.$store.commit('absences', data);
				console.log(data);
			})
			.catch (this.$app.catchError)
			.finally(() => {
				console.log('finally');
			});
			console.log('qqechose');
		},

		...mapActions(['closeElement'])
	},

	components: {
    AppWrapper,
    AppMenu,
    AppMenuItem,
    ValidationItem,
    UserImage
},

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