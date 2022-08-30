<template>
    <router-link :to="{name: 'absence_details', params: {absenceId: absence.id}}" custom v-slot="{navigate, href}">
        
        <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="navigate" :href="href">
            <div>
                {{formatDateFr(absence.dd)}} <i class="bi bi-chevron-compact-right"></i> {{formatDateFr(absence.df)}}
                <span class="text-secondary">Demandé à <UserImage size="user-image-sm" :name="manager.cache_nom" className="d-inline-block" v-if="manager.id" /> {{manager.cache_nom}}</span>
            </div>

            <ValidationStatus :absence="absence" classPrefix="badge text-bg-"></ValidationStatus>
        </a>
    </router-link>
</template>

<script>
import ValidationStatus from './ValidationStatus.vue';
import dateFormatLib from '../js/formatDateFr.js'
import { mapState } from 'vuex';
import UserImage from './pebble-ui/UserImage.vue';

export default {
    props: {
        absence: Object
    },

    computed: {
        ...mapState(['openedPersonnelManagers']),

        manager() {
            let manager = this.openedPersonnelManagers.find(m => m.id === this.absence.validation_personne_id);
            return manager ? manager : { cache_nom: 'non-renseigné' };
        }
    },

    methods: {
        formatDateFr(date) {
            return dateFormatLib(date);
        }
    },
    components: { ValidationStatus, UserImage }
}



</script>