<template>
    <div>
        <hero :title="$root.info.title"></hero>
        <section class="section">
            <div class="container">
                <tabs></tabs>
                <Submissions :submissions="$root.submissions"></Submissions>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Hero from '@/components/Hero.vue';
import Tabs from '@/components/Tabs.vue';
import Submissions from '@/components/Submissions.vue';

@Component({
    components: {
        Hero,
        Tabs,
        Submissions,
    },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
    // @import "~bulma/bulma";
    @import "../node_modules/bulma/sass/utilities/_all.sass";
    @import "../node_modules/bulma/sass/base/_all.sass";
    // @import "../node_modules/bulma/sass/components/_all.sass";
    @import "../node_modules/bulma/sass/components/list.sass";
    @import "../node_modules/bulma/sass/components/modal.sass";
    @import "../node_modules/bulma/sass/components/navbar.sass";
    @import "../node_modules/bulma/sass/components/tabs.sass";
    // @import "../node_modules/bulma/sass/elements/_all.sass";
    @import "../node_modules/bulma/sass/elements/button.sass";
    @import "../node_modules/bulma/sass/elements/container.sass";
    @import "../node_modules/bulma/sass/elements/content.sass";
    @import "../node_modules/bulma/sass/elements/form.sass";
    @import "../node_modules/bulma/sass/elements/notification.sass";
    @import "../node_modules/bulma/sass/elements/table.sass";
    @import "../node_modules/bulma/sass/elements/title.sass";
    // @import "../node_modules/bulma/sass/grid/_all.sass";
    // @import "../node_modules/bulma/sass/layout/_all.sass";
    @import "../node_modules/bulma/sass/layout/hero.sass";
    @import "../node_modules/bulma/sass/layout/section.sass";
</style>
