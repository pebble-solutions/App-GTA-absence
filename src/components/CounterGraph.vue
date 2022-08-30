<template>
    <div :id="'chart-personnel-'+personnel.id" style="width: 100%;" class="my-1" v-if="arrayStats.length"></div>
    <div v-else class="card-body text-muted text-center"><i class="bi bi-bar-chart"></i> Pas de données à afficher</div>
</template>

<script>
import { GoogleCharts } from 'google-charts';


export default {

    props: {
        stats: Object,
        personnel: Object
    },

    computed: {
        /**
         * Convertie l'objet de statistique en array lisible par google chart
         * @returns {Array}
         */
        arrayStats() {
            let ar = [];
            for (const key in this.stats) {
                ar.push(this.stats[key]);
            }
            return ar;
        }
    },

    watch: {
        stats() {
            this.drawVisualization();
        }
    },

    methods: {
        /**
         * affiche le google Chart chart_div avec les données fournies
         */
        drawVisualization() {

            if (this.arrayStats.length) {
                let div = document.getElementById("chart-personnel-"+this.personnel.id);
    
                let dataTable = [
                    ["Compteur", "Pris", "Refusé"]
                ];
    
                this.arrayStats.forEach(counter => {
                    dataTable.push([counter.label, counter.approuved, counter.refused]);
                });
    
                // Some raw data (not necessarily accurate)
                let data = GoogleCharts.api.visualization.arrayToDataTable(dataTable);
                let options = {
                    seriesType: "bars",
                    series: {
                        0: { color: "#198754", visibleInLegend: false },
                        1: { color: "#adb5bd", visibleInLegend: false }
                    }
                };
                let chart = new GoogleCharts.api.visualization.ComboChart(div);
                chart.draw(data, options);
            }

        },

    },

    beforeUnmount() {
        window.removeEventListener("resize", this.drawVisualization)
    },

    mounted() {
        GoogleCharts.load(this.drawVisualization);
        window.addEventListener("resize", this.drawVisualization);
    },
    
}
</script>