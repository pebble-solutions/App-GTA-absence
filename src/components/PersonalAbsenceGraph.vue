<template>
    <div  id="piechart" tabindex="-1" style="width: 99%;"></div>
</template>

<script>
import {GoogleCharts} from 'google-charts';


export default {

    props: {
        stats: Object
    },

    watch: {
        stats() {
            this.pieChart();
        }
    },

    methods: {
        pieChart() {

            let div = document.getElementById("piechart");

            if (div) {

                let data = GoogleCharts.api.visualization.arrayToDataTable([
                    ["Absences", "Quantité"],
                    ["Validées", this.stats.approuved],
                    ["Refusées", this.stats.refused],
                    ["En attente", (this.stats.total - this.stats.approuved - this.stats.refused)]
                ]);
                let options = {
                    //title: 'mes demandes d\'absence',
                    is3D: false,
                    pieHole: 0.4,
                    legend: "none",
                    pieSliceText: "value",
                    slices: {
                        0: { color: "#198754" },
                        1: { color: "#dc3545" },
                        2: { color: "#ffc107" },
                    }
                    // primary: #0074d9  warning: #ffc107 danger: #dc3545 success: #198754 info: #0dcaf0
                };
                // let options = {
                // 	title: 'demande absence en attente',
                // 	// colors: ['#0d6efd','#198754','#ffc107']
                // };
                let chart = new GoogleCharts.api.visualization.PieChart(div);
                chart.draw(data, options);
            }
        }
    },

    mounted() {
        GoogleCharts.load(this.pieChart);

        window.addEventListener("resize", () => {
            this.pieChart();
        });
        window.addEventListener("load", () => {
            this.pieChart();
        });


    }


}
</script>