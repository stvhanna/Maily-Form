<template>
    <section class="hero">
        <div class="hero-head">
            <nav class="navbar">
                <div class="navbar-brand">
                    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                       @click="(showNav = !showNav)"
                       v-bind:class="{'is-active': showNav}">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div class="container">
                    <div class="navbar-menu"
                         v-bind:class="{'is-active': showNav}">
                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="field is-grouped">
                                    <p class="control">
                                        <a class="button is-danger"
                                           @click="$root.logout()">Logout</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <div class="hero-body">
            <div class="container">
                <h1 class="title">{{ title }}</h1>
                <h2 class="subtitle">Manage submissions</h2>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class Hero extends Vue {
    public showNav: boolean = false;

    @Prop(String) public title!: string;
}
</script>
