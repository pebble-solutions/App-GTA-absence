<template>
    <div class="accordion" id="accordionMonth">
        <div v-for="month in 12" :key="'mois-' + month" class="accordion-item">
            <AccordionMonthItem :month="month"></AccordionMonthItem>
        </div>
    </div>
</template>

<script>
import AccordionMonthItem from "./AccordionMonthItem.vue";

export default {
    components: { AccordionMonthItem }
}
</script>