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
            <a class="has-text-info" @click="$root.viewSubmission(submission.id)">View</a>
            <div class="modal" v-bind:class="{'is-active':($root.openSubmission === submission.id)}">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{{ submission.formName }}: #{{ submission.id }}</p>
                    </header>
                    <section class="modal-card-body">
                        <div class="is-italic has-text-weight-light">{{ new Date(submission.time).toLocaleString() }}
                        </div>
                        <div class="is-italic has-text-weight-light">{{ submission.replyTo }}</div>
                        <br/>
                        <div v-html="submission.text"></div>
                        <br/>
                        <label>
                            <b>Response:</b>
                            <textarea class="textarea" v-if="(submission.response === null)"
                                      placeholder="Write a response" v-model="$root.tempResponse"></textarea>
                            <textarea class="textarea" v-if="(submission.response != null)"
                                      readonly>{{ submission.response }}</textarea>
                        </label>
                        <br/>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" @click="$root.closeSubmission()">Close</button>
                        <button class="button is-success" @click="$root.respond(submission.id, $root.tempResponse)"
                                v-if="(submission.response === null)">Send response
                        </button>
                        <button class="button is-warning" @click="$root.archiveSubmission(submission.id)"
                                v-if="($route.params.selector !== 'archive')">Archive
                        </button>
                        <button class="button is-warning" @click="$root.unarchiveSubmission(submission.id)"
                                v-if="($route.params.selector === 'archive')">Unarchive
                        </button>
                        <button class="button is-danger" @click="$root.deleteSubmission(submission.id)">Delete</button>
                    </footer>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
    export default {
        name: 'submission',
        props: {
            submission: {
                type: Object,
                required: true
            }
        }
    }
</script>
