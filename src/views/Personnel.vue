<template>
    <div v-if="openedElement">
        <HeaderToolbar>
            <div class="d-flex align-items-center">
                <span class="d-md-none">
                    <UserImage size="user-image-sm" :name="openedElement.cache_nom" className="me-2" />
                </span>
                <PeriodDropdown v-if="personnelStats" @period-change="periodChange" />
            </div>
        </HeaderToolbar>

        <div class="container">

            <div class="my-3 d-flex align-items-center d-md-none lead text-secondary" v-if="openedElement">
				<span>{{openedElement.cache_nom}}</span>
			</div>

            <div class="alert alert-danger" v-if="error">{{error}}</div>
                    

            <div v-if="openedElement.primary === true" class="card my-3">
                <div class="card-body">
                    <AbsenceForm @add-absence="addAbsence" @absence-recorded="routeToAbsenceConfig"></AbsenceForm>
                </div>
            </div>
            <div class="card my-3">
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <h2 class="card-title m-0">Demandes d'absence</h2>
                    </div>

                    <Spinner v-if="pending.absences"></Spinner>
                    <AlertMessage icon="bi bi-x-square" variant="danger mt-3 mb-0" v-else-if="!pending.absences && !openedPersonnelAbsences.length">
                        Pas de demande d'absence
                    </AlertMessage>
                </div>

                <AccordionMonth v-if="!pending.absences && selectedPeriod" :period="selectedPeriod"></AccordionMonth>

            </div>
        </div>

        <router-view />
    </div>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AbsenceForm from '../components/AbsenceForm.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import AccordionMonth from '../components/AccordionMonth.vue';
import HeaderToolbar from '../components/pebble-ui/toolbar/HeaderToolbar.vue';
import PeriodDropdown from '../components/PeriodDropdown.vue';
import UserImage from '../components/pebble-ui/UserImage.vue';
import sqlDateToIso from '../js/sqlDateToIso';

export default {
    data() {
        return {
            pending: {
                absences:true,
                personnel: true
            },
            error: null,
            codages: [],
            selectedPeriod: null
        }
    },

    emits: ['refresh'],
    
    computed: {
        ...mapState(['openedElement', 'openedPersonnelAbsences', 'openedPersonnelManagers', 'personnelStats'])
    },

    components: { Spinner, AbsenceForm, AlertMessage, AccordionMonth, HeaderToolbar, PeriodDropdown, UserImage },

    methods: {

        ...mapActions(['setOpenedPersonnelAbsences', 'addOpenedPersonnelAbsences', 'unloadPersonnel', 'setOpenedPersonnelManagers']),

        load(id) {
            this.$store.dispatch('load', id);
            if (this.selectedPeriod) {
                this.loadAbsences(id, {
                    dd: this.selectedPeriod.period_start_date,
                    df: this.selectedPeriod.period_end_date,
                    limit: 100
                });
            }
        },
        

        /**
         * Récupère la liste des managers disponibles pour le personnel en cours
         */
        listManager() {
            let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/nx';
            this.$app.apiGet(apiUrl)
            .then((data) => {
                this.setOpenedPersonnelManagers(data);
            })
            .catch(this.$app.catchError);
        },
    

        /**
         * Charge les déclarations depuis le serveur
         */
        loadAbsences(personnelId, options) {
            let apiUrl = 'structurePersonnel/GET/'+personnelId+'/absence';
            this.pending.absences = true;
            this.$app.apiGet(apiUrl, options)
            .then( (data) => {
                this.setOpenedPersonnelAbsences(data.result);
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.absences = false;
            });
        },

        /**
         * Ajoute une absence à la liste des absences.
         * Si l'absence est sur la période sélectionnée, ajout simple. Si l'absence est sur une autre période,
         * on recharge les statistiques et on bascule sur la nouvelle période.
         * 
         * @param {Object} absence Une absence
         */
        addAbsence(absence) {
            let dateAbsence = new Date(sqlDateToIso(absence.dd));
            let datePeriodStart = new Date(this.selectedPeriod.period_start_date);
            let datePeriodEnd = new Date(this.selectedPeriod.period_end_date);

            // L'absence est sur la période chargée, ajout simple
            if (dateAbsence.getTime() >= datePeriodStart.getTime && dateAbsence.getTime() <= datePeriodEnd.getTime()) {
                this.addOpenedPersonnelAbsences([absence]);
            }
            // L'absence est sur une autre période, rafraichissement des données
            else {
                this.$emit('refresh');
                this.$app.dispatchEvent("current-date-change", dateAbsence);
            }

        },

        /**
         * Redirige le client vers la vue de modification de l'absence
         * @param {Object} absence Un objet représentant une absence
         */
        routeToAbsenceConfig(absence) {
            this.$router.push('/personnel/'+this.openedElement.id+'/absence_details/'+absence.id+'/edit');
        },

        /**
		 * Modifie la période sélectionnée pour l'affichage des informations
		 * @param {Object} period Nouvelle période sélectionnée
		 */
		periodChange(period) {
			this.selectedPeriod = period;
            this.loadAbsences(this.openedElement.id, {
                dd: period.period_start_date,
                df: period.period_end_date,
                limit: 100
            });
		}

    },

    beforeRouteUpdate(to, from) {
        if (to.params.id !== from.params.id) {
            this.load(to.params.id);
        }
    },

    beforeRouteLeave(from, to, next) {
        this.unloadPersonnel();
        next();
    },

    mounted() {
        this.load(this.$route.params.id);
        this.listManager();
    }
}
</script>