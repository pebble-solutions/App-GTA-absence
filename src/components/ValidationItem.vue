<template>
    <a href="#" @click.prevent="toggleSelection()" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
		:class="{active: isChecked}">
		<div class="d-flex align-items-center">
			<i class="bi me-3" :class="{'bi-square':!isChecked, 'bi-check-square':isChecked}"></i>
			<div>
				{{absence.personnel_nom}}<br>
				<span :class="{'text-secondary': !isChecked}">{{formatDateFr(absence.dd)}} > {{formatDateFr(absence.df)}}</span>
			</div>
		</div>
		<ValidationStatus :absence="absence" display-mode="icon" class-prefix="badge text-bg-"/>
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