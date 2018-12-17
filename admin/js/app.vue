<template>
    <div>
        <hero :title="$root.info.title"></hero>
        <section class="section">
            <div class="container">
                <tabs></tabs>
                <submissions :submissions="$root.submissions"></submissions>
            </div>
        </section>
    </div>
</template>


<script>
    import hero from './hero.vue'
    import tabs from './tabs.vue'
    import submissions from './submissions.vue'

    export default {
        name: 'app',
        components: {
            hero,
            tabs,
            submissions
        }
    }
</script>
