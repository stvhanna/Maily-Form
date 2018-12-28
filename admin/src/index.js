import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import app from './app.vue';
import loginView from './login.vue';

// Styles
import './styles.scss';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/sent',
            component: app
        },
        {
            name: 'login',
            path: '/login',
            component: loginView
        },
        {
            name: 'submissions',
            path: '/:selector',
            component: app
        },
        {
            name: 'modal',
            path: '/:selector/:sid',
            component: app
        }
    ]
});

const vueApp = new Vue({
    router: router,
    el: '#app',
    data: {
        loggedIn: false,
        info: {
            title: "Administration"
        },
        submissions: []
    },
    methods: {
        login: login,
        logout: logout,
        deleteSubmission: deleteSubmission,
        archiveSubmission: archiveSubmission,
        unarchiveSubmission: unarchiveSubmission,
        respond: respond,
        deleteSubmissions: deleteSubmissions
    },
    watch: {
        '$route'(to, from) {
            if (this.loggedIn && from.params.selector !== to.params.selector) {
                getSubmissions(to.params.selector);
            } else if (!this.loggedIn && to.path !== "/login") {
                router.replace({path: '/login'});
            }
        }
    },
    mounted() {
        checkLogin();
    }
});

function checkLogin() {
    let token = findToken();
    if (token === null) {
        router.replace({path: '/login'});
    } else {
        axios.get(`/api/auth`, {
            headers: {
                "Authorization": "Basic " + token
            }
        }).
            then(() => {
                login();
                getSubmissions(router.currentRoute.params.selector);
            }).
            catch(() => {
                router.replace({path: '/login'});
            });
    }
}

function findToken() {
    let token = null;
    if (sessionStorage.getItem("authToken") != null) {
        token = sessionStorage.getItem("authToken");
    } else {
        token = localStorage.getItem("authToken");
    }
    return token;
}

function login() {
    axios.defaults.headers.common = {
        "Authorization": "Basic " + findToken()
    };
    vueApp.loggedIn = true;
    getInfo();
}

function logout() {
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authToken");
    axios.defaults.headers.common = {
        "Authorization": ""
    };
    vueApp.loggedIn = false;
    router.replace({path: '/login'});
}

function getInfo() {
    axios.get(`/api/info`).
        then(response => {
            vueApp.info = response.data.result;
            document.title = vueApp.info.title;
        })
}

function deleteSubmission(id) {
    axios.delete(`/api/${id}`).
        then(() => getSubmissions(router.currentRoute.params.selector))
}

function archiveSubmission(id) {
    axios.post(`/api/archive/${id}`).
        then(() => getSubmissions(router.currentRoute.params.selector))
}

function unarchiveSubmission(id) {
    axios.delete(`/api/archive/${id}`).
        then(() => getSubmissions(router.currentRoute.params.selector))
}

function respond(id, text) {
    axios.post(`/api/respond/${id}`, {text: text}).
        then(() => getSubmissions(router.currentRoute.params.selector))
}

function getSubmissions(selector) {
    axios.get(`/api/${selector}`).
        then(response => (vueApp.submissions = response.data.result.submissions))
}

function deleteSubmissions(selector) {
    axios.delete(`/api/${selector}`).
        then(() => getSubmissions(router.currentRoute.params.selector))
}
