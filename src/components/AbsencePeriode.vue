<template>
    <div class="list-group-item">
        
        <div> {{periode.period_day}}/{{periode.period_month}}/{{periode.period_year}} </div>


       <!-- {{periode}}
-->    
    </div>
</template>

<script>

export default {
    props: {
        periode: Object
    }
}

</script>