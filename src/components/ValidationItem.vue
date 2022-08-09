<template>
    <a v-if="!absence.valider" href="#" @click.prevent="toggleSelection()" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
		:class="{active: isChecked}">
		<div class="d-flex align-items-center">
			<i class="bi" :class="{'bi-square':!isChecked, 'bi-check-square':isChecked}"></i>
			<div class="d-flex flex-column ms-3">
				<p>Personnel {{absence.structure__personnel_id}}<br> {{formatDateFr(absence.dd)}} > {{formatDateFr(absence.df)}} </p>
			</div>
		</div>
		<ValidationStatus :absence="absence" classPrefix="badge text-bg-"/>
    </a>

</template>

<script>
import { mapActions } from 'vuex';
import ValidationStatus from './ValidationStatus.vue';
//import dateAndTime from 'date-and-time';


export default {
    props: {
        absence: Object
    },

    data() {
		return {
			isChecked: false,
			pending: false
        };
    },
	
    components: { ValidationStatus },

	methods: {
		...mapActions (["addAbsenceValidation", "removeAbsenceValidation"]),

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

			if(this.isChecked) {
				this.pending = true;
				
				this.addAbsenceValidation ({absence: this.absence, app: this.$app})
				.catch(this.$app.catchError)
				.finally(() => {
					this.pending = false;
				});

			} else {
				this.removeAbsenceValidation({absence: this.absence, app: this.$app});
			}
		}
	},
}

</script>