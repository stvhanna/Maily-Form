import axios from 'axios';
import Vue from 'vue';

import hero from './hero.vue';
import tabs from './tabs.vue';
import submissions from './submissions.vue';

const app = new Vue({
    el: '#app',
    data: {
        info: {},
        selector: "sent",
        submissions: [],
        openSubmission: -1,
        tempResponse: ""
    },
    methods: {
        deleteSubmission: deleteSubmission,
        archiveSubmission: archiveSubmission,
        unarchiveSubmission: unarchiveSubmission,
        viewSubmission: viewSubmission,
        closeSubmission: closeSubmission,
        respond: respond
    },
    components: {
        'hero': hero,
        'tabs': tabs,
        'submissions': submissions
    },
    watch: {
        selector: function (val) {
            getSubmissions(val)
        }
    },
    mounted() {
        getInfo();
        getSubmissions(this.selector)
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
        then(_ => getSubmissions(app.selector))
}

function archiveSubmission(id) {
    axios.post(`/api/archive/${id}`).
        then(_ => getSubmissions(app.selector))
}

function unarchiveSubmission(id) {
    axios.delete(`/api/archive/${id}`).
        then(_ => getSubmissions(app.selector))
}

function respond(id, text) {
    axios.post(`/api/respond/${id}`, {text: text}).
        then(_ => getSubmissions(app.selector));
    app.tempResponse = ""
}

function getSubmissions(selector) {
    axios.get(`/api/${selector}`).
        then(response => (app.submissions = response.data.result.submissions))
}

function viewSubmission(id) {
    app.openSubmission = id
}

function closeSubmission() {
    app.openSubmission = -1
}
