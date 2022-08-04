<template>
    <div class="container">
        <h1 class="py-2">Demandes d'absence en attente</h1>
            <!--<div class="card-body">Pour traiter</div> -->

        <div v-for="abs in absences_validation" :key='abs.absence.id' class="card my-4">
            <div class="card-body">
                Personnel: {{abs.absence.structure__personnel_id}}
                <AbsenceConfigOverview 
                    :absence="abs.absence" 
                    :codages="abs.codages" 
                    :declarations="abs.declarations" 
                    :editable="false" 
                    :managers="abs.managers" 
                    :periodes="abs.periodes"
                    :toolbar="false"/>
            </div>
        </div>

        
        <div class="d-flex flex-column align-items-center justify-content-center bg-light shadow-lg p-3 mb-4 mx-4 bg-body rounded limitWidth" v-if="absences_validation.length">
            <div class="pt-2">Pour la sélection:</div>
            <div class="d-flex gap-2 py-3">
                <button class="btn btn-lg btn-success" @click.prevent="setActionRoute('authorize')">
                    Autoriser
                </button>
                <button class="btn btn-lg btn-danger" @click.prevent="setActionRoute('refuse')">
                    Refuser
                </button>
            </div>
        </div>
        
        <div v-else class="card"> 
            <div class="card-header">
                <h2>Traitement des demandes:</h2>
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush list-group-numbered">
                    <li class ="list-group-item"> Sélectionnez d'un clic les demandes à traiter dans la liste</li>
                    <li class ="list-group-item"> Autorisez ou refusez les demandes sélectionnées</li>
                    <li class ="list-group-item"> Commentez votre décision</li>
                    <li class ="list-group-item"> Validez</li>
                </ul>
            </div>
        </div>
        

        <AppModal id="validation" title="Validation" :display="validation_modal" :footer="false" backdrop="static">
            <AbsenceValidation 
                :absences="absences"
                :validation_action="validation_action"

                @recorded="refreshAbsencesAndClose"
                @cancel="closeValidationModal"
                />
        </AppModal>
    </div>  
</template>
<script>

import { mapState } from 'vuex';
import AbsenceConfigOverview from '../components/AbsenceConfigOverview.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';
import AbsenceValidation from '../components/AbsenceValidation.vue';


export default {
    inheritAttrs: false,

    data() {
        return {
            validation_action: true,
            validation_modal: false,
            modal: null,
            
        }
    },

    computed: {
        ...mapState(["absences_validation"]),

        absences() {
            let absences = [];
            this.absences_validation.forEach(a => {
                absences.push(a.absence);
            });
            return absences;
        }
    },

    methods: {
        /**
         * Converti une date fourni au format francophone DD/MM/YYYY
         *
         * @param {String|Date} date date à transformer
         *
         * @returns {String}
         */
        formatDateFr(date) {
            let newDate = new Date(date);
            let format = newDate.toLocaleDateString("fr-FR");
            return format;
        },
        /**
         * ferme la modal de validation et supprime les absences sélectionnées
         * @param {Object} absences la liste des absences à autoriser ou refuser // a valider avec Guillaume
         */
        refreshAbsencesAndClose(absences){
            this.$store.commit ('refresh_absences', absences);
            this.absences_validation.forEach((absence, index) => {
                if(absence.absence.valider == "OUI") {
                    this.absences_validation.splice(index ,1)
                }
            });
            console.log ('avant refresh', absences);
            console.log('absence',absences);
            console.log('absenceValidation', this.absences_validation);
            console.log('refresh', absences);
            this.closeValidationModal();
        },

        // refreshDatas(payload) {
        //     for (const key in payload) {
        //         this[key] = payload[key];
        //     }
        // },

        closeValidationModal() {
            this.validation_modal = false;
        },

        checkRouteMode(action){
            console.log(action)
            if(action == 'authorize' || action == 'refuse') {
                this.validation_action = action == 'authorize' ? true : false;
                this.validation_modal = true;
            } else {
                this.validation_modal = false;
            }
        },

        setActionRoute(action) {
            this.$router.push('/validation/'+action)
        }
    },

    components: { AbsenceConfigOverview, AppModal, AbsenceValidation },

    beforeRouteUpdate(to) {
        console.log(to)
        this.checkRouteMode(to.params.action);
    },

    mounted(){
        this.checkRouteMode(this.$route.params.action);

        this.modal = document.getElementById('validationModal');
        this.modal.addEventListener ('hidden.bs.modal', () => {
            this.$router.push('/validation');
        });
        console.log(AbsenceValidation);
    }
}

</script>
<style lang ="scss" scoped>
.limitWidth {   
    position: fixed;
    bottom: 0px;
    z-index: 500;
    box-sizing: border-box;
    right: 0px;
    left:0px;
}
@media (min-width: 576px) {
    .limtiWidth {
        left: 52px;
    }
}
@media (min-width :1024px) {

    .limitWidth {
        left: 402px;
        max-width :1306px;
    }
}

</style>


