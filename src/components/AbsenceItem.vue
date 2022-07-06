<template>
    <router-link :to="{name: 'absence_details', params: {absenceId: absence.id}}" custom v-slot="{navigate, href}">
        <a class="list-group-item list-group-item-action" @click="navigate" :href="href" >{{absence}}</a>
    </router-link>
</template>

<script>

export default {
    props: {
        absence: Object
    }
}
</script>