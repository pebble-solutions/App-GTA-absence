<template>
    <div :id="'chart-personnel-'+personnel.id" style="width: 97%;"></div>
</template>

<script>
import { GoogleCharts } from 'google-charts';


export default {

    props: {
        counters: Array,
        personnel: Object
    },

    methods: {
        /**
         * affiche le google Chart chart_div avec les données fournies
         */
        drawVisualization() {

            let div = document.getElementById("chart-personnel-"+this.personnel.id);

                let dataTable = [
                    ["Compteur", "Acquis", "Pris", "Solde"]
                ];
    
                this.counters.forEach(counter => {
                    dataTable.push([counter.label, counter.acquis, counter.pris, counter.solde]);
                });
    
                // Some raw data (not necessarily accurate)
                let data = GoogleCharts.api.visualization.arrayToDataTable(dataTable);
                let options = {
                    //title: "Mon compteur",
                    // vAxis: {title: 'Cups'},
                    // hAxis: {title: 'Month'},
                    seriesType: "bars",
                    // series: {3: {type: 'line'}},
                    series: {
                        0: { color: "#0074d9", visibleInLegend: false },
                        1: { color: "#0dcaf0", visibleInLegend: false },
                        2: { color: "#198754", visibleInLegend: false }
                    },
                    // bars: 'vertical'
                };
                let chart = new GoogleCharts.api.visualization.ComboChart(div);
                chart.draw(data, options);
        }

    },
    
    // beforeMount(){
    //     window.addEventListener("load", () => {
    //         this.drawVisualization();
    //     });
    // },

    mounted() {
        
        GoogleCharts.load(this.drawVisualization);

        window.addEventListener("resize", () => {
            this.drawVisualization();
        });
        // window.addEventListener("load", () => {
        //     this.drawVisualization();
        // });
    },
    
}
</script>