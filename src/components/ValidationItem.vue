<template>
    <a href="#" @click.prevent="toggleSelection()" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
		:class="{active: isChecked}">
		<div class="d-flex align-items-center">
			<i class="bi" :class="{'bi-square':!isChecked, 'bi-check-square':isChecked}"></i>
			<div class="d-flex flex-column ms-3">
				<p>Prénom Nom {{absence.structure__personnel_id}}<br> {{formatDateFr(absence.dd)}} > {{formatDateFr(absence.df)}} </p>
				
			</div>
		</div>
		<ValidationStatus :absence="absence" classPrefix="badge text-bg-"/>
    </a>
		<div class="bg-light">{{absence}}</div>

</template>

<script>
import ValidationStatus from './ValidationStatus.vue';
//import dateAndTime from 'date-and-time';


export default {
    props: {
        absence: Object
    },

    data() {
		return {
			isChecked: false,
        };
    },

    components: { ValidationStatus },

	methods: {

		/**
		 * Converti une date fourni au format francophone DD/MM/YYYY
		 * 
		 * @param {String|Date} date date à transformer
		 * 
		 * @returns {String}
		 */
		formatDateFr(date) {
			let newDate = new Date(date);
			let format = newDate.toLocaleDateString("fr-FR");
			return format;
		},

		/**
		 * 
		 */
		toggleSelection() {
			this.isChecked = !this.isChecked;
		}
	},
}

</script>