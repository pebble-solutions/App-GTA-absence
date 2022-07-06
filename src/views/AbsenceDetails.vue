<template>
    <AppModal id="absenceDetails" title="Demande d'absence" :display="true">
        <Absence :absence="absence" :managers="managers" />
    </AppModal>

</template>

<script>
import { mapState } from 'vuex';
import Absence from '../components/Absence.vue';
import AppModal from '../components/pebble-ui/AppModal.vue';

export default {
    props: {
        absences: Array,
        managers: Array
    },
    
    data() {
        return {
            modal: null
        }
    }, 

    computed: {
        absence() {
            let absence_id = this.$route.params.absenceId;
            return this.absences.find(e => e.id == absence_id);
        },

        ...mapState(['openedElement'])
    },
    components: { Absence, AppModal },

    mounted() {
        this.modal = document.getElementById('absenceDetailsModal');

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.$router.push('/personnel/'+this.openedElement.id);
        });
    }
}

</script>