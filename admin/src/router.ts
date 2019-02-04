import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/components/Login.vue';
import App from '@/App.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '*',
            redirect: '/sent',
            component: App,
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
        },
        {
            name: 'submissions',
            path: '/:selector',
            component: App,
        },
        {
            name: 'modal',
            path: '/:selector/:sid',
            component: App,
        },
    ],
});
