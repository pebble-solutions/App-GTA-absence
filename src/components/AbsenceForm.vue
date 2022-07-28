<!--
    Affichage d'un formulaire pour créer un nouvelle demande d'absence.

    Événements émits :
    - add-absence Object absence : lorsque l'absence est enregistée sur le serveur
    - absence-recorded Object absence : lorsque l'ensemble du processus est terminé
-->

<template>
    <form @submit.prevent="createAbsence()" method="post" action="/">
        <h2 class="mb-3">Nouvelle demande d'absence</h2>
        <div class="row">
            <div class="col-12 col-md-8">
                <label for="absence_dd" class="form-label">Dates de l'absence</label>
                <Datepicker  v-model="dateAbsence" id="absence_dd" autoApply :minDate="new Date()" :enableTimePicker="false" format="dd/MM/yyyy" range></Datepicker><!-- :format="format"  -->
            </div>
            <div class="col-12 col-md-4">
                <label for="" class="form-label">&nbsp;</label>
                <button class="form-control btn btn-outline-primary" type="submit" :disabled="pending">
                    <span>Créer</span>
                </button>
            </div>
        </div>
    </form>
</template>


<script>

import dateAndTime from 'date-and-time';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            absence : null,
            dateAbsence: [],
            periodesAbsence: [],
            pending:false,
            codages: []
        }
    },

    emits: ['add-absence', 'absence-recorded'],

    components: {
        Datepicker
    },

    computed: {
        ...mapState(['openedElement']),
    },

    methods: {
        /**
         * Envoie une requête pour créer une période d'absence basée sur la date de début et la date de 
         * fin renseignée via le formulaire.
         * 
         * 1. Envoie d'une requête pour créer l'absence
         * 2. Envoie d'une requête pour récupèrer les codages dispos pour la config de l'absence
         * 3. Affichage de la route de configuration de l'absence
         */
        createAbsence() {
            
            let apiUrl = 'structurePersonnel/POST/'+this.openedElement.id+'/absence';
 
            let dd = dateAndTime.format(this.dateAbsence[0], 'YYYY-MM-DD');
            let df = dateAndTime.format(this.dateAbsence[1], 'YYYY-MM-DD');

            this.pending = true;

            this.$app.apiPost(apiUrl, {
                dd,
                df
            })
            .then( (data) => {
                this.periodesAbsence = data.periode;
                this.absence = data.absence[0];

                this.$emit('add-absence', this.absence)

                //this.addAbsence(this.absence);

                let apiUrl = 'structurePersonnel/GET/'+this.openedElement.id+'/absence/'+this.absence.id+'/codage';
                return this.$app.apiGet(apiUrl);
            })
            .then((data) => {
                this.codages = data.result;
                this.$emit('absence-recorded', this.absence);
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending = false;
            });
        }
    },

    mounted() {
        const start = new Date();
        const end = new Date();

        this.dateAbsence = [start, end];
    }
}

</script>