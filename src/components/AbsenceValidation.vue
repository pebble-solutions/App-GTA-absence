<template>
    <form action="/" method="post" @submit.prevent="record()">
        <div class="lead">Validation de {{pluralize('demande', absences.length, true)}}</div>

        <div class="my-3 lead" :class="actionClass">{{actionLabel}}</div>

        <div class="my-3">
            <label for="commentaire_n1" class="form-label">Commentaire valideur</label>
            <textarea name="commentaire_n1" id="commentaire_n1" rows="5" class="form-control" v-model="commentaire_n1"></textarea>
        </div>

        <div class="d-grid my-3">
            <button class="btn btn-primary" :disabled="pending">
                <span v-if="pending"><span class="spinner-border spinner-border-sm" role="status"></span> Enregistrement...</span>
                <span v-else>Terminer</span>
            </button>
        </div>
    </form>
</template>

<script>

import pluralize from 'pluralize';

export default {
    props: {
        absences: Array,
        validation_action: Boolean
    },

    data() {
        return {
            commentaire_n1: '',
            pending: false
        }
    },

    emits: ['recorded'],

    computed: {
        /**
         * Retourne une classe css en fonction de l'action à réaliser. success si l'absence est acceptée,
         * danger si elle est refusée
         * @returns {String}
         */
        actionClass() {
            return this.validation_action ? 'text-success' : 'text-danger';
        },

        /**
         * Retourne un libellé en fonction de l'action à réaliser. Accordées ou refusées.
         */
        actionLabel() {
            let s = this.absences.length > 1 ? 's' : '';

            if (this.validation_action) return `Demande${s} accordée${s}`;
            else return `Demande${s} refusée${s}`;
        }
    },

    methods: {
        /**
         * Enregistre la série d'absences et émet un événement à la fin du processus.
         */
        record() {
            this.pending = true;

            let absences_ids = [];

            this.absences.forEach((a) => {
                absences_ids.push(a.id);
            });

            this.$app.apiPost('gtaAbsence/POST/'+absences_ids.join(',')+'/valider', {
                valider: this.validation_action,
                commentaire_n1: this.commentaire_n1
            })
            .then((data) => {
                this.$emit('recorded', data);
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending = false;
            });
        },

        /**
         * Utilistion de la librairie pluralize
         */
        pluralize(word, number, inclusive) {
            return pluralize(word, number, inclusive);
        }
    }
}

</script>