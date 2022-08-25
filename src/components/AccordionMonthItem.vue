<template>
    <h2 class="accordion-header" :id="'panelsStayOpen-heading'+month">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelsStayOpen-collapse'+month" aria-expanded="false" :aria-controls="'panelsStayOpen-collapse'+month">
            {{monthMappageFr[month-1]}}
            <span class="badge bg-secondary ms-2">{{absencesInMonthList.length}}</span>
        </button>
    </h2>

    <div :id="'panelsStayOpen-collapse'+month" class="accordion-collapse collapse" :aria-labelledby="'panelsStayOpen-heading'+month">
        <div class="accordion-body">
            <div v-if="absencesInMonthList.length > 0">
                <AbsenceItem :absence="absence" v-for="absence in absencesInMonthList" :key="'absence-'+absence.id" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AbsenceItem from './AbsenceItem.vue';

export default {
    props: {
        month: Number
    },
    data() {
        return {
            monthMappageFr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        };
    },
    computed: {
        ...mapState(["openedPersonnelAbsences"]),
        absencesInMonthList() {
            let abs = this.openedPersonnelAbsences.filter(abs => (new Date(abs.dd)).getMonth() + 1 == this.month.toFixed(2));
            return abs;
        }
    },
    
    components: { AbsenceItem }
}
</script>