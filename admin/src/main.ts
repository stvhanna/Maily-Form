import Vue from 'vue';
import axios from 'axios';
import router from './router';

Vue.config.productionTip = false;

const vueApp = new Vue({
    router,
    el: '#app',
    data: {
        loggedIn: false,
        info: {
            title: 'Administration',
        },
        submissions: [],
    },
    methods: {
        logout,
        deleteSubmissions,
        deleteSubmission,
        archiveSubmissions,
        archiveSubmission,
        unarchiveSubmission,
        respond,
    },
    watch: {
        $route(to, from) {
            if (this.loggedIn && from.params.selector !== to.params.selector) {
                getSubmissions(to.params.selector);
            } else if (!this.loggedIn && to.path !== '/login') {
                router.replace({path: '/login'});
            }
        },
    },
    mounted() {
        checkLogin();
    },
});

function checkLogin() {
    const token = findToken();
    if (token === null) {
        router.replace({path: '/login'});
    } else {
        axios
            .get(`/api/auth`, {
                headers: {
                    Authorization: 'Basic ' + token,
                },
            })
            .then(() => {
                login();
                getSubmissions(router.currentRoute.params.selector);
            })
            .catch(() => {
                router.replace({path: '/login'});
            });
    }
}

function findToken() {
    let token = null;
    if (window.sessionStorage.getItem('authToken') != null) {
        token = window.sessionStorage.getItem('authToken');
    } else {
        token = window.localStorage.getItem('authToken');
    }
    return token;
}

export function login() {
    axios.defaults.headers.common = {
        Authorization: 'Basic ' + findToken(),
    };
    vueApp.loggedIn = true;
    getInfo();
}

function logout() {
    window.sessionStorage.removeItem('authToken');
    window.localStorage.removeItem('authToken');
    axios.defaults.headers.common = {
        Authorization: '',
    };
    vueApp.loggedIn = false;
    router.replace({path: '/login'});
}

function getInfo(): void {
    axios.get(`/api/info`).then((response) => {
        vueApp.info = response.data.result;
        document.title = vueApp.info.title;
    });
}

function getSubmissions(selector: string): void {
    if (selector === null) {
        selector = router.currentRoute.params.selector;
    }
    axios
        .get(`/api/get/selector/${selector}`)
        .then((response) => (vueApp.submissions = response.data.result.submissions));
}

function deleteSubmissions(selector: string): void {
    axios
        .post(`/api/delete/selector/${selector}`)
        .then(() => getSubmissions(router.currentRoute.params.selector));
}

function deleteSubmission(id: string): void {
    axios
        .post(`/api/delete/id/${id}`)
        .then(() => getSubmissions(router.currentRoute.params.selector));
}

function archiveSubmissions(selector: string): void {
    axios
        .post(`/api/archive/selector/${selector}`)
        .then(() => getSubmissions(router.currentRoute.params.selector));
}

function archiveSubmission(id: string): void {
    axios
        .post(`/api/archive/id/${id}`)
        .then(() => getSubmissions(router.currentRoute.params.selector));
}

function unarchiveSubmission(id: string): void {
    axios
        .post(`/api/unarchive/id/${id}`)
        .then(() => getSubmissions(router.currentRoute.params.selector));
}

function respond(id: string, text: string): void {
    axios
        .post(`/api/respond/id/${id}`, {text})
        .then(() => getSubmissions(router.currentRoute.params.selector));
}
