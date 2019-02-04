<template>
    <div class="tabs">
        <ul>
            <li v-bind:class="{'is-active':($route.params.selector === 'sent')}">
                <router-link to="/sent">Sent</router-link>
            </li>
            <li v-bind:class="{'is-active':($route.params.selector === 'spam')}">
                <router-link to="/spam">Spam</router-link>
            </li>
            <li v-bind:class="{'is-active':($route.params.selector === 'archive')}">
                <router-link to="/archive">Archive</router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Tabs extends Vue {

    }
</script>
