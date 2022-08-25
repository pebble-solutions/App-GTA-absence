<template>
    <AppModal id="absenceDetails" title="Demande d'absence" :display="true" :footer="false" backdrop="static">
        <Spinner v-if="pending.datas" />

        <template v-else>
            <AbsenceConfigOverview 
                :absence="absence" 
                :periodes="periodes"
                :codages="codages"
                :declarations="declarations"

                :editable="isEditable"

                @edit-mode="setActionRoute('edit')"
                @authorize="setActionRoute('authorize')"
                @refuse="setActionRoute('refuse')"
                
                v-if="mode == 'overview'" />

            <AbsenceConfigForm
                :absence="absence" 
                :periodes="periodes"
                :codages="codages"
                :declarations="declarations"

                @recorded="refreshAndSwitch"
                @cancel="switchToOverviewMode"
                
                v-else-if="mode == 'edit'" />
            
            <AbsenceValidation 
                :absences="[absence]"
                :validation_action="validation_action"

                @recorded="refreshAbsenceAndSwitch"
                @cancel="switchToOverviewMode"

                v-else-if="mode == 'validation'"
                />
        </template>
    </AppModal>

</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import AbsenceConfigOverview from '../components/AbsenceConfigOverview.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AbsenceConfigForm from '../components/AbsenceConfigForm.vue';
import AbsenceValidation from '../components/AbsenceValidation.vue';

export default {
    
    data() {
        return {
            modal: null,
            periodes: [],
            codages: [],
            declarations: [],
            absence: null,
            pending: {
                datas:true
            },
            mode: 'overview',
            validation_action: null
        }
    }, 

    computed: {
        ...mapState(['openedElement']),
        ...mapGetters(['primary_personnel', 'openedPersonnelAbsences']),
        
        /**
         * Contrôle si l'élément est éditable. Un élément est éditable dans les condtions suivantes
         * - Il n'a pas été validé
         * - Il appartient à l'utilisateur connecté
         * Les deux conditions doivent être réunies
         * 
         * @return {Boolean}
         */
        isEditable() {
            if (this.absence.valider === null && this.absence.structure__personnel_id == this.primary_personnel.id) return true;
            return false;
        }
    },

    components: { AbsenceConfigOverview, AppModal, Spinner, AbsenceConfigForm, AbsenceValidation },

    methods: {
        ...mapActions(['updateOpenedPersonnelAbsences']),

        /**
         * Met à jour les informations stockées au niveau de data et passe en mode overview
         * 
         * @param {Object} payload L'ensemble des données à mettre à jour
         * - periodes
         * - declarations
         * - absence
         */
        refreshAndSwitch(payload) {
            this.refreshDatas(payload);
            this.updateOpenedPersonnelAbsences([payload.absence]);
            this.switchToOverviewMode();
        },

        /**
         * Met à jour la GtaAbsence chargée depuis une liste de GtaAbsence (post-enregistrement)
         * et bascule en mode overview
         * @param {Array} absences Collection de GtaAbsence
         */
        refreshAbsenceAndSwitch(absences) {
            this.absence = absences[0];
            this.updateOpenedPersonnelAbsences(absences);
            this.switchToOverviewMode();
        },

        /**
         * Met à jour les données stockées. Si une clé n'est pas disponible, data n'est pas modifié.
         * 
         * @param {Object} payload L'ensemble des données à mettre à jour
         * - periodes
         * - declarations
         * - absence
         */
        refreshDatas(payload) {
            for (const key in payload) {
                this[key] = payload[key];
            }
        },

        /**
         * Bascule en mode consultation. La route est modifiée.
         */
        switchToOverviewMode() {
            this.$router.push('/personnel/'+this.openedElement.id+'/absence_details/'+this.absence.id);
        },

        /**
         * Modification de l'action de la route
         */
        setActionRoute(action) {
            this.$router.push('/personnel/'+this.openedElement.id+'/absence_details/'+this.absence.id+'/'+action);
        },

        /**
         * Vérifie la route active afin de basculer dans le bon mode (overview ou edit)
         * @param {String} action           Action fournie par l'url
         */
        checkRouteMode(action) {
            if (action == 'edit') this.mode = 'edit';
            else if (action == 'authorize' || action == 'refuse') {
                this.mode = 'validation';
                this.validation_action = action == 'authorize' ? true : false;
            }
            else this.mode = 'overview';
        }
    },

    beforeRouteUpdate(to) {
        this.checkRouteMode(to.params.action);
    },

    mounted() {

        // Chargement des informations concernant l'absence passée en url
        this.$app.apiGet("structurePersonnel/GET/" + this.openedElement.id + "/absence/" + this.$route.params.absenceId)
        .then((data) => {
            this.periodes = data.result.periode;
            this.codages = data.result.codage;
            this.declarations = data.result.declaration;
            this.absence = data.result.absence[0];

            this.pending.datas = false;
        })
        .catch(this.$app.catchError);

        this.checkRouteMode(this.$route.params.action);

        this.modal = document.getElementById('absenceDetailsModal');

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.$router.push('/personnel/'+this.openedElement.id);
        });
    }
}

</script>