<template>
    <router-link :to="{name: 'absence_details', params: {absenceId: absence.id}}" custom v-slot="{navigate, href}">
        <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="navigate" :href="href">
            <div>
                {{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}
            </div>
            <div>
                <div class="text-warning" v-if="absence.valider === null">
                    <span class="d-none d-md-block">En attente</span>
                    <i class="bi bi-circle d-block d-md-none"></i>
                </div>

                <div class="text-success" v-else-if="absence.valider === 'OUI'">
                    <span class="d-sm-none">Validée</span>
                    <i class="bi bi-check-circle"></i>
                </div>

                <div class="text-danger" v-else>
                    <span v-if="this.winWidth > 576">Refusée</span>
                    <span v-else><i class="bi bi-x-circle fs-2"></i></span>
                </div>
            </div>
        </a>
    </router-link>
</template>

<script>

export default {
    props: {
        absence: Object
    },

    methods: {

        formatDateFr(date) {

            let newDate = new Date(date);
            let format = newDate.toLocaleDateString('fr-FR');
            return format;
        }        

    }

}



</script>