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
		absences: [],
		openedPersonnelAbsences: [],
		openedPersonnelManagers: []
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
		},

		/**
		 * met à jour les données des absen,ces stockées dans le state.
		 * Pour chaque absence, si l'id existe déjà dans le state,
		 * les informations sont mises à jour.
		 * dans le cas contraire la nouvelle absence est ajoutée à la
		 * fin du state absences.
		 * 
		 * @param {Object} state le state de vuex
		 * @param {Array} absences les absences à mettre à jour dans le state 
		 */
		refresh_absences(state, absences) {
			absences.forEach(absence => {
				let stateAbsence = state.absences.find (a => a.id === absence.id);
				if (stateAbsence) {
					for (const key in absence) {
						stateAbsence[key] = absence [key];
					}
				}
				else {
					state.absences.push (absence);
				}
			});

		},

		/**
		 * Réaliser une modification sur la collection des absences du personnel sélectionné dans la liste.
		 * 
		 * @param {Object} state Le state VueX
		 * @param {Object} absencesOptions 
		 * 		- absence {Object} L'absence sur laquelle est réalisée la mise à jour
		 * 		- absences {Array} Une liste d'absences sur lesquelles sont réalisées les mises à jour
		 * 		- action {String} 'add' (ajouter), 'remove' (retirer), 'replace' (remplace l'ensemble de la 
		 * 		  collection par la nouvelle collection fournie), 'reset' (réinitialise la collection à 0), 
		 * 	 	  'update' (met à jour les informations des absences fournies. Si une ou plusieurs absences 
		 *        fournies n'existent pas dans la collection, elle seront ajoutées à la fin)
		 */
		openedPersonnelAbsences(state, absencesOptions) {
			let absences = absencesOptions.absences;

			if (!absences) {
				absences = [];
			}

			if (absencesOptions.absence) {
				absences.push(absencesOptions.absence);
			}

			let action = absencesOptions.action;

			if (action == 'add') {
				absences.forEach(absence => {
					state.openedPersonnelAbsences.push(absence);
				})
			}
			else if (action == 'remove') {
				absences.forEach(absence => {
					let index = state.openedPersonnelAbsences.findIndex(a => a.id === absence.id);

					if (index !== -1) {
						state.openedPersonnelAbsences.splice(index, 1);
					}
				})
			}
			/* En mode update, on met à jour les informations existantes pour les absences déjà chargées 
			 * dans le store. Les absences non présentes dans le store sont ajoutées à la collection.
			 */
			else if (action == 'update') {
				absences.forEach(absence => {
					let found = state.openedPersonnelAbsences.find(a => a.id === absence.id);

					if (found) {
						for (const key in absence) {
							found[key] = absence[key];
						}
					}
					else {
						state.openedPersonnelAbsences.push(absence)
					}
				})
			}
			/* Reset réinitialise la collection avec un tableau vide.
			 */
			else if (action == 'reset') {
				state.openedPersonnelAbsences = [];
			}
			else {
				state.openedPersonnelAbsences = absences;
			}
		},


		/**
		 * Réalise une modification sur la collection des managers du personnel ouvert
		 * 
		 * @param {Object} state L'instance VueX
		 * @param {Object} managersOptions 
		 * - managers {Array} Collection de managers
		 * - action {String} 'replace', 'reset'
		 */
		openedPersonnelManagers(state, managersOptions) {
			let managers = managersOptions.managers;
			let action = managersOptions.action;

			if (action == 'reset') {
				state.openedPersonnelManagers = [];
			}
			else {
				state.openedPersonnelManagers = managers;
			}
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
		unloadPersonnel(context) {
			context.commit('close');
			context.commit('openedPersonnelAbsences', { action: 'reset' });
			context.commit('openedPersonnelManagers', { action: 'reset' });
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
					absence: absence,
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
		},

		/**
		 * Ajoute des absences dans la collection des absences du personnel ouvert.
		 * 
		 * @param {Object} context Instance VueX
		 * @param {Array} absences Collection d'absences
		 */
		addOpenedPersonnelAbsences(context, absences) {
			context.commit('openedPersonnelAbsences', { absences, action: 'add' });
		},

		/**
		 * Retire des absences dans la collection des absences du personnel ouvert.
		 * 
		 * @param {Object} context Instance VueX
		 * @param {Array} absences Collection d'absences
		 */
		removeOpenedPersonnelAbsences(context, absences) {
			context.commit('openedPersonnelAbsences', { absences, action: 'remove' });
		},

		/**
		 * Remplace la collection des absences du personnel ouvert
		 * 
		 * @param {Object} context Instance VueX
		 * @param {Array} absences Collection d'absences
		 */
		setOpenedPersonnelAbsences(context, absences) {
			context.commit('openedPersonnelAbsences', { absences, action: 'replace' });
		},

		/**
		 * Réinitialise la collection des absences du personnel ouvert
		 * 
		 * @param {Object} context Instance VueX
		 */
		resetOpenedPersonnelAbsences(context) {
			context.commit('openedPersonnelAbsences', { action: 'reset' });
		},

		/**
		 * Met à jour les informations des absences présentes dans la collection et ajoute les nouvelles.
		 * 
		 * @param {Object} context Instance VueX
		 * @param {Array} absences Collection d'absences
		 */
		updateOpenedPersonnelAbsences(context, absences) {
			context.commit('openedPersonnelAbsences', { action: 'update' , absences });
		},

		/**
		 * Remplace la collection des managers du personnel ouvert
		 * 
		 * @param {Object} context Instance VueX
		 * @param {Array} managers Collection de managers
		 */
		setOpenedPersonnelManagers(context, managers) {
			context.commit('openedPersonnelManagers', { managers, action: 'replace' });
		},

		/**
		 * Réinitialise la collection des managers du personnel ouvert
		 * 
		 * @param {Object} context Instance VueX
		 */
		resetOpenedPersonnelManagers(context) {
			context.commit('openedPersonnelManagers', { action: 'reset' });
		},
	},
	modules: {
	}
})
