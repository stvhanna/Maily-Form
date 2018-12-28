<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="box">
                    <div v-if="(success === false)"
                         class="notification is-danger is-fullwidth">
                        Login failed, please try again!
                    </div>
                    <form>
                        <div class="field">
                            <div class="control">
                                <input v-model="username" class="input" type="text" placeholder="Username"
                                       autofocus="">
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <input v-model="password" class="input" type="password" placeholder="Password">
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <label class="checkbox"><input v-model="remember" type="checkbox"> Remember</label>
                            </div>
                        </div>
                        <button class="button is-block is-info is-fullwidth"
                                @click="login()">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'login',
        methods: {
            login: function () {
                let token = btoa(this.username + ":" + this.password);
                axios.get(`/api/auth`, {headers: {'Authorization': "Basic " + token}}).
                    then(() => {
                        this.remember ? localStorage.setItem("authToken", token) : sessionStorage.setItem("authToken", token);
                        this.$root.login();
                        this.$router.replace({path: '/sent'});
                    }).
                    catch(() => {
                        this.success = false;
                    });
            }
        },
        data() {
            return {
                success: null,
                username: "",
                password: "",
                remember: false
            }
        }
    }
</script>
