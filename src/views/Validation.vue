<template>
    <h1 class="m-3">Demandes d'absence en attente</h1>
    <div v-for="abs in absences_validation" :key='abs.absence.id' class="card my-3">
        <div class="card-body">
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

    

    <div class="card d-flex flex-row align-items-center justify-content-between">
        <div class="ms-2">Pour la sélection:</div>
        <div class="d-grid gap-2 d-flex justify-content-end me--2">
            <a href="">
                <div class="btn btn-lg btn-success">Autoriser</div>
            </a>
            <a href="">
                <div class="btn btn-lg  btn-danger">Refuser</div>
            </a>
        </div>
    
    </div>
    
</template>
<script>

import { mapState } from 'vuex';
import AbsenceConfigOverview from '../components/AbsenceConfigOverview.vue';


export default {
    inheritAttrs: false,
    computed: {
        ...mapState(["absences_validation"])
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
        }
    },
    components: { AbsenceConfigOverview }
}

</script>


