<template>
    <tr>
        <th scope="row">{{ submission.id }}</th>
        <td v-bind:title="submission.time">{{ new Date(submission.time).toLocaleString() }}</td>
        <td>{{ submission.formName }}</td>
        <td>{{ submission.replyTo }}</td>
        <td v-html="submission.text"></td>
        <td>
            <a class="has-text-danger" @click="$root.deleteSubmission(submission.id)">Delete</a>
            <a class="has-text-warning" @click="$root.archiveSubmission(submission.id)"
               v-if="($route.params.selector !== 'archive')">Archive</a>
            <a class="has-text-warning" @click="$root.unarchiveSubmission(submission.id)"
               v-if="($route.params.selector === 'archive')">Unarchive</a>
            <router-link :to="{ name: 'modal', params: { selector: $route.params.selector, id: submission.id }}">
                View
            </router-link>
            <modal :submission="submission"></modal>
        </td>
    </tr>
</template>

<script>
    import modal from './modal.vue'

    export default {
        name: 'submission',
        props: {
            submission: {
                type: Object,
                required: true
            }
        },
        components: {
            modal
        }
    }
</script>
