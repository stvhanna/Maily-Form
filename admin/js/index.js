import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import hero from './hero.vue';
import submissions from './submissions.vue';
import tabs from './tabs.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/sent'
        },
        {
            name: 'submissions',
            path: '/:selector',
            component: submissions
        },
        {
            name: 'modal',
            path: '/:selector/:id',
            component: submissions
        }
    ]
});

const app = new Vue({
    router: router,
    el: '#app',
    data: {
        info: {},
        submissions: [],
        tempResponse: ""
    },
    methods: {
        deleteSubmission: deleteSubmission,
        archiveSubmission: archiveSubmission,
        unarchiveSubmission: unarchiveSubmission,
        respond: respond
    },
    components: {
        'hero': hero,
        'tabs': tabs,
        'submissions': submissions
    },
    watch: {
        '$route'(to, from) {
            if (from.params.selector !== to.params.selector) {
                getSubmissions(to.params.selector)
            }
        }
    },
    mounted() {
        getInfo();
        getSubmissions(router.currentRoute.params.selector)
    }
});

function getInfo() {
    axios.get(`/api/info`).
        then(response => {
            app.info = response.data.result;
            document.title = app.info.title;
        })
}

function deleteSubmission(id) {
    axios.delete(`/api/${id}`).
        then(_ => getSubmissions(router.currentRoute.params.selector))
}

function archiveSubmission(id) {
    axios.post(`/api/archive/${id}`).
        then(_ => getSubmissions(router.currentRoute.params.selector))
}

function unarchiveSubmission(id) {
    axios.delete(`/api/archive/${id}`).
        then(_ => getSubmissions(router.currentRoute.params.selector))
}

function respond(id, text) {
    axios.post(`/api/respond/${id}`, {text: text}).
        then(_ => getSubmissions(router.currentRoute.params.selector));
    app.tempResponse = ""
}

function getSubmissions(selector) {
    axios.get(`/api/${selector}`).
        then(response => (app.submissions = response.data.result.submissions))
}
