<template>
    <div>
        <div>{{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}</div>

        <div class="list-group">
            <AbsencePeriode :periode="periode" v-for="periode in periodes" :key="'periode-'+periode.id" />
        </div>

        {{manager}}
    </div>
</template>

<script>
import AbsencePeriode from './AbsencePeriode.vue';

export default {
    props: {
        absence: Object,
        managers: Array
    },

    data() {
        return {
            codages: [],
            periodes: []
        };
    },

    methods: {

        formatDateFr(date) {

            let newDate = new Date(date);
            let format = newDate.toLocaleDateString('fr-FR');
            return format;
        }        

    },

    computed: {
        /**
         * Retourne l'objet du responsable
         */
        manager() {
            return this.managers.find(e => e.id == this.absence.validation_personne_id);
        }
    },

    mounted() {
        this.$app.apiGet("structurePersonnel/GET/" + this.absence.structure__personnel_id + "/absence/" + this.absence.id)
        .then((data) => {
            this.periodes = data.result.periode;
            this.codages = data.result.codage;
            console.log(data.result);
        })
        .catch(this.$app.catchError);
    },
    components: { AbsencePeriode }
}

</script>