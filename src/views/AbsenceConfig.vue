<template>
    <AppModal id="absenceConfig" title="Demande d'absence" :submit-btn="true" :pending="pending" :display="display" @submit="record" :size="lg">
        <h2 class="mb-3">Configurez votre demande</h2>
        <div class="list-group list-group-flush">
            <div class ="list-group-item d-flex flex-row align-items-baseline" v-for="periode in periodesAbsence" :key="'periode-'+periode.id">
                <label class="mx-1">{{periode.period_day}}/{{periode.period_month}}/{{periode.period_year}}</label>
                <select class="form-select mx-1">
                    <option v-for="codage in codages" :key="codage.id">{{codage.nom}}</option>
                </select>
                <button class="mx-1 btn btn-outline-danger"> <span> <i class="bi bi-x-circle-fill"></i></span></button>
            </div>
            <div class="list-group-item d-flex flex-row align-items-center justify-content-between">
                <div class="">Demandez validation à</div>
                <div class="col-5"><select name="validateur" id="validateur" class="form-select mx-1">
                    <option v-for="manager in managers" :key="manager.id"> {{manager.cache_nom}} </option>
                </select></div>
            </div>
        </div>
    </AppModal>
</template>

<script>

import AppModal from "../components/pebble-ui/AppModal.vue";

export default {

    props: {
        periodesAbsence: Array,
        codages: Array,
        managers: Array
    },

    data() {
        return {
            pending: false
        }
    },

    components: {
        AppModal
    },

    methods: {
        record() {

        }
    }

}

</script>