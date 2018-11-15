<template>
    <div class="table-container">
        <table class="table is-bordered is-fullwidth">
            <thead class="thead-dark">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Time</th>
                <th scope="col">Form Name</th>
                <th scope="col">Reply-To</th>
                <th scope="col">Text</th>
                <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr is="submission"
                v-for="submission in submissions"
                :key="submission.id"
                :submission="submission"></tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import submission from './submission.vue'

    export default {
        name: 'submissions',
        props: {
            submissions: {
                type: Array,
                required: true
            }
        },
        components: {
            submission
        }
    }
</script>
