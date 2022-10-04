<template>
    <div class="accordion accordion-flush" id="accordionMonth">
        <div v-for="month in months" :key="'mois-' + month.getTime()" class="accordion-item">
            <AccordionMonthItem :month="month"></AccordionMonthItem>
        </div>
    </div>
</template>

<script>
import AccordionMonthItem from "./AccordionMonthItem.vue";

export default {
    components: { AccordionMonthItem },

    props: {
        period: Object
    },

    computed: {
        /**
         * Retourne une collection de dates représentant les mois de l'exercice.
         */
        months() {
            let dateStart = new Date(this.period.period_start_date);
            let dateEnd = new Date(this.period.period_end_date);
            let date = dateStart;

            let dates = [date];

            while (date.getTime() < dateEnd.getTime()) {
                date = new Date(date);
                date.setMonth(date.getMonth() + 1);

                dates.push(date);
            }

            return dates;
        }
    }
}
</script>