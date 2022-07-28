import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		openedElement: null,
		tmpElement: null,
		absences_validation: [],
		absences: []
	},
	getters: {
		activeStructure(state) {
			return state.structures.find(e => e.id === state.activeStructureId);
		},

		primary_personnel(state) {
			return state.elements.find(e => e.primary == true);
		}
	},
	mutations: {
		/**
		 * Charge un objet dans openedElement
		 * @param {Object} state Le state de l'instance VueX
		 * @param {Integer} id L'ID de l'élément à charger
		 */
		open(state, id) {
			state.openedElement = id;
		},


		/**
		 * Ferme l'élément ouvert
		 * @param {Object} state Le state de l'instance VueX
		 */
		close(state) {
			state.openedElement = null;
		},

		/**
		 * Remplace la liste des éléments chargés avec une nouvelle liste
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		replaceElements(state, elements) {
			state.elements = elements;
		},

		/**
		 * Rafraichie la liste des éléments chargés à partir d'une autre liste.
		 * - si un élément existe dans state et dans elements, il est actualisé avec le nouveau
		 * - si un élément est dans elements mais pas dans state, il est ajouté
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		updateElements(state, elements) {
			elements.forEach(element => {
				let stateEl = state.elements.find(e => e.id === element.id);

				// Mise à jour d'un élément existant
				if (stateEl) {
					for (let key in element) {
						stateEl[key] = element[key];
					}
				}
				// Ajout d'un élément existant
				else {
					state.elements.push(element);
				}
			});
		},

		/**
		 * Retire des éléments de la liste des éléments chargés
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} elements Les ID des éléments à retirer
		 */
		removeElements(state, elements) {
			elements.forEach(id => {
				let index = state.elements.findIndex(e => e.id === id);

				if (index !== -1) {
					state.elements.splice(index, 1);
				}
			});
		},

		/**
		 * Met à jour les données de l'élément chargé
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Liste clé valeur des infos à mettre à jour
		 */
		updateOpened(state, data) {
			for (let key in data) {
				state.openedElement[key] = data[key];
			}
		},

		/**
		 * Enregistre le login dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} login L'objet Login
		 */
		setLogin(state, login) {
			state.login = login;
		},

		/**
		 * Enregistre les structures chargées dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} structures La liste des structures
		 */
		setStructures(state, structures) {
			state.structures = structures;
		},

		/**
		 * Enregistre une donnée dubliqué de openedElement
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Un objet identique à la structure de openedElement
		 */
		tmpElement(state, data) {
			state.tmpElement = data;
		},

		/**
		 * Enregistre la structure active dans le store
		 * @param {Object} state Le state de vueX
		 * @param {Integer} structureId L'id de la structure à activer
		 */
		setStructureId(state, structureId) {
			state.activeStructureId = structureId;
		},

		/**
		 * Réalise une modification de la collection d'absences stockées dans absence_validation
		 * 
		 * @param {Object} state le state de VueX
		 * @param {Object} absenceOptions 
		 * 		- absence {Object} l'absence sur laquelle doit être réalisée
		 * 		- action {String} 'add' (ajouter l'absence), 'remove' (retirer l'absence), 'reset' (vider le tableau)  
		 */
		absences_validation (state, absenceOptions) {

			let absenceData = absenceOptions.absenceData;
			let action = absenceOptions.action;

			if (action == 'add') {
				state.absences_validation.push(absenceData);
			}
			else if (action == 'remove') {
				let index = state.absences_validation.findIndex(a => a.absence.id === absenceData.absence.id);
				if (index !== -1) {
					state.absences_validation.splice (index,1);
				}
			}
			else if(action == 'reset') {
				state.absences_validation = [];
			}
		},

		absences (state, absences) {
			state.absences = absences;
		}
	},
	actions: {
		/**
		 * Charge un élément depuis le store via son ID
		 * @param {Object} context Instance VueX
		 * @param {Integer} elementId Id de l'élément à charger depuis les éléments existants ou depuis l'API
		 */
		load(context, elementId) {
			let el = context.state.elements.find(e => e.id == elementId);

			if (el) {
				context.commit('open', el);
			}
			else {
				// Il faut générer une requête pour charger l'élément manquant
				console.log('Not found');
			}
		},

		

		/**
		 * Ferme l'élément ouvert
		 * @param {Object} context Instance VueX
		 */
		unload(context) {
			context.commit('close');
		},

		/**
		 * Met à jour la liste des éléments chargés
		 * @param {Object} context L'instance VueX
		 * @param {Object} payload Les paramètres de rafraichissement
		 * - action			update (default), replace, remove
		 * - elements		la liste des éléments
		 */
		refreshElements(context, payload) {
			if (!('action' in payload)) {
				payload.action = 'update';
			}

			if (payload.action == 'update') {
				context.commit('updateElements', payload.elements);
			}
			else if (payload.action == 'replace') {
				context.commit('replaceElements', payload.elements);
			}
			else if (payload.action == 'remove') {
				context.commit('removeElements', payload.elements);
			}
			else {
				throw new Error(`La mutation ${payload.action} n'existe pas.`);
			}
		},

		/**
		 * Met à jour les infos de l'élément ouvert avec des données
		 * @param {Object} context L'instance vueX
		 * @param {Object} data Liste clé valeur des informations à mettre à jour
		 */
		refreshOpened(context, data) {
			context.commit('updateOpened', data);
		},

		/**
		 * Enregistre l'ouverture d'une session
		 * @param {Object} context L'instance vueX
		 * @param {Object} payload Un objet contenant une clé login et une clé structure
		 */
		login(context, payload) {
			context.commit('setLogin', payload.login);
			context.commit('setStructures', payload.structures);
		},

		/**
		 * Enregistre la fermeture d'une session
		 * @param {Object} context L'instance vueX
		 */
		logout(context) {
			context.commit('setLogin', null);
			context.commit('setStructures', []);
		},

		/**
		 * Bascule sur une structure
		 * @param {Object} context L'instance vueX
		 * @param {Integer} payload L'ID de la structure active
		 */
		switchStructure(context, payload) {
			context.commit('close');
			context.commit('tmpElement', null);
			context.commit('replaceElements', []);
			context.commit('setStructureId', payload);
		},

		/**
		 * Ajoute une absence à la liste des absences sélectionnées
		 * @param {Object} context instance Vuex
		 * @param {Object} absenceOptions
		 * 		- absence {Object} L'absence à ajouter
		 * 		- app {Object} l'instance de l'application App.JS liée
		 */
		addAbsenceValidation(context, absenceOptions) {
			return context.dispatch('loadAbsenceData', absenceOptions)
			.then((absenceData) => {
				context.commit('absences_validation', {absenceData, action:'add'});
			})
		},

		/**
		 * Retire une absence à la liste des absences sélectionnées
		 * @param {Object} context instance Vuex
		 * @param {Object} absenceOptions
		 * 		- absence {Object} L'absence à retirer
		 * 		- app {Object} l'instance de l'application App.JS liée
		 */
		removeAbsenceValidation(context, absenceOptions) {
			let absence = absenceOptions.absence;
			context.commit('absences_validation', {absenceData: {absence}, action:'remove'});
		},

		/**
		 * Envoie une requête à l'API pour charger les données détaillées d'une absence :
		 * - absence
		 * - managers
		 * - periodes
		 * - codages
		 * - declarations
		 * - managers
		 * 
		 * @param {Object} context instance vuex
		 * @param {Object} absenceOptions 
		 * 		- absence {Object} l'absence à traiter
		 * 		- vm {Object} instance vueJS contenant une application de $app
		 * 
		 * @returns {Promise}
		 */
		loadAbsenceData(context, absenceOptions) {
			let absence = absenceOptions.absence;
			let app = absenceOptions.app;

			let absenceData = {};

			return app.apiGet("structurePersonnel/GET/" + absence.structure__personnel_id + "/absence/" + absence.id)
			.then((data) => {
				let abs = data.result;
				absenceData = {
					absence: abs.absence[0],
					codages: abs.codage,
					declarations: abs.declaration,
					periodes: abs.periode
				};
				return app.apiGet('structurePersonnel/GET/'+absence.structure__personnel_id+'/nx');
			})
			.then((managers) => {
				absenceData.managers = managers;
				return absenceData;
			})
			.catch(app.catchError);
		}
	},
	modules: {
	}
})
