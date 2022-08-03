<template>
    <router-link :to="{name: 'absence_details', params: {absenceId: absence.id}}" custom v-slot="{navigate, href}">
        
        <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="navigate" :href="href">
            <div>
                {{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}
            </div>

            <ValidationStatus :absence="absence" classPrefix="badge text-bg-"></ValidationStatus>
        </a>
    </router-link>
</template>

<script>
import ValidationStatus from './ValidationStatus.vue';

export default {
    props: {
        absence: Object
    },
    methods: {
        formatDateFr(date) {
            let newDate = new Date(date);
            let format = newDate.toLocaleDateString("fr-FR");
            return format;
        }
    },
    components: { ValidationStatus }
}



</script>