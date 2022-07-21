<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <div>{{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}</div>
            <span v-if="absence.valider === null" class="text-warning">En attente</span>
            <span v-else-if="absence.valider === 'OUI'" class="text-success">Validée</span>
            <span v-else class="text-danger">Refusée</span>
        </div>
        <div class="list-group">
            <AbsencePeriode :periode="periode" :valider="absence.valider" :declarations="getDeclarations(periode.id)" :codages="codages" v-for="periode in periodes" :key="'periode-'+periode.id" />
        </div>
        <div v-if="manager">
            <div v-if="!absence.valider">
                <div v-if="manager.cache_nom">Responsable validateur: {{manager.cache_nom}}</div>
                <div>Commentaire: {{absence.commentaire}}</div>
            </div>
            <div v-else-if="absence.valider === 'OUI'">
                <div v-if="manager.cache_nom">Responsable validateur: {{manager.cache_nom}}</div>
                <div>Commentaire: {{absence.commentaire}}</div>
            </div>
            <div v-else>
                <div v-if="manager.cache_nom">Responsable validateur: {{manager.cache_nom}}</div>
                <div>Commentaire: {{absence.commentaire}}</div>
                <div>Commentaire de la hiérarchie: {{absence.commentaire_n1}}</div>
            </div>
        </div>
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
            periodes: [],
            declarations: []
        };
    },

    methods: {

        getDeclarations(periodeid) {
            let result = this.declarations.find((d) => d.gta__periode_id === periodeid);
            return result;
        },



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
        console.log('le manager', this.manager);

        this.$app.apiGet("structurePersonnel/GET/" + this.absence.structure__personnel_id + "/absence/" + this.absence.id)
        .then((data) => {
            console.log(data);
            this.periodes = data.result.periode;
            this.codages = data.result.codage;
            this.declarations = data.result.declaration;
            console.log(data.result);
        })
        .catch(this.$app.catchError);

        this.$app.apiGet("structurePersonnel/GET/" + this.absence.structure__personnel_id + "'nx'")
        .then((data) => {
            console.log(data);
        })
        .catch(this.$app.catchError);
    },


    components: { AbsencePeriode }
}

</script>