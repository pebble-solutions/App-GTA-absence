<template>
    <div class="dropdown">
        <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-calendar me-2"></i> Année {{selectedYear}}
        </button>
        <ul class="dropdown-menu">
            <li v-for="(item, period_year) in periods" :key="'period-item-'+period_year">
                <button class="dropdown-item" @click.prevent="selectedPeriod = item" :class="{'active' : isActivePeriod(item)}">
                    {{period_year}}
                    <span class="d-block" :class="{'text-light' : isActivePeriod(item), 'text-secondary' : !isActivePeriod(item) }">Du {{formatDateFr(item.period_start_date)}} au {{formatDateFr(item.period_end_date)}}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import formatDateFr from '../js/formatDateFr';

export default {

    data() {
        return {
            selectedPeriod: null
        }
    },

    emits: ['period-change'],

    computed: {
        ...mapState(['personnelStats']),

        /**
         * Retourne l'année de la période sélectionnée
         * @returns {Number}
         */
        selectedYear() {
            let dateSelected;

            if (this.selectedPeriod) {
                dateSelected = new Date(this.selectedPeriod.period_start_date);
            }
            else {
                dateSelected = new Date();
            }

            return this.getPeriodFromDate(dateSelected, 'year');
        },

        /**
         * Retourne la liste des périodes existantes sur l'ensemble des statistiques chargées.
         */
        periods() {
            let periods = {};

            for (const key in this.personnelStats) {
                for (const year in this.personnelStats[key].per_period) {
                    if (!periods[year]) {
                        periods[year] = this.personnelStats[key].per_period[year];
                    }
                }
            }

            return periods;
        }
    },

    watch: {
        /**
         * Lorsque la période sélectionnée change, un événement est envoyé au parent.
         * @param {Object} period Nouvelle période sélectionnée
         */
        selectedPeriod(period) {
            this.$emit('period-change', period);
        }
    },

    methods: {
        /**
         * Retourne true lorsque la période passée en paramètre est sélectionnée. Si aucune 
         * periode n'est sélectionnée, on prend la date du jour.
         * 
         * @param {Object} period La description statistique d'une période conventionnelle
         * 
         * @returns {Boolean}
         */
        isActivePeriod(period) {
            
            if (this.selectedPeriod) {
                return (period.period_start_date == this.selectedPeriod.period_start_date && period.period_end_date == this.selectedPeriod.period_end_date);
            }
            else {
                let dateStart = new Date(period.period_start_date);
                let dateEnd = new Date(period.period_end_date);
                let now = new Date();
                return (now.getTime() >= dateStart.getTime() && now.getTime() <= dateEnd.getTime());
            }
        },

        /**
         * Convertie une date SQL en date au format français
         * @param {String} date Date au format YYYY-MM-DD
         */
        formatDateFr(date) {
            return formatDateFr(date);
        },

        /**
         * Retourne la période associée à une date
         * @param {Date} date La date à analyser
         * @param {String} return_value 'year' ou 'period' (par défaut 'period')
         * 
         * @return {Number | Object | null}
         */
        getPeriodFromDate(date, return_value) {
            return_value = typeof return_value === 'undefined' ? 'period' : return_value;

            for (const key in this.periods) {
                let period = this.periods[key];
                let dateStart = new Date(period.period_start_date);
                let dateEnd = new Date(period.period_end_date);

                if (date.getTime() >= dateStart.getTime() && date.getTime() <= dateEnd.getTime()) {
                    return return_value === 'year' ? key : period;
                }
            }

            return null;
        }
    },

    /**
     * Lors de l'initialisation, l'année active est sélectionnée par défaut
     */
    mounted() {
        let dateSelected = new Date();
        this.selectedPeriod = this.getPeriodFromDate(dateSelected, 'period');
    }
}

</script>