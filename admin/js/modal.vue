<template>
    <div class="modal" v-bind:class="{'is-active':(parseInt($route.params.sid) === submission.id)}">
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
                <div v-if="(submission.response != null)">
                    <b>Response:</b>
                    <div v-html="submission.response"></div>
                </div>
                <label v-if="(submission.response === null)">
                    <b>Response:</b>
                    <textarea class="textarea"
                              v-if="(submission.response === null)"
                              placeholder="Write a response"
                              v-model="tempResponse"></textarea>
                </label>
                <br/>
            </section>
            <footer class="modal-card-foot">
                <div class="buttons">
                    <a class="button"
                       @click="$router.go(-1)">
                        Close
                    </a>
                    <a class="button is-success"
                       @click="respond()"
                       v-if="(submission.response === null)">
                        Send response
                    </a>
                    <a class="button is-warning"
                       @click="$root.archiveSubmission(submission.id)"
                       v-if="($route.params.selector !== 'archive')">
                        Archive
                    </a>
                    <a class="button is-warning"
                       @click="$root.unarchiveSubmission(submission.id)"
                       v-if="($route.params.selector === 'archive')">
                        Unarchive
                    </a>
                    <a class="button is-danger"
                       @click="$root.deleteSubmission(submission.id)">
                        Delete
                    </a>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    function respond() {
        this.$root.respond(this.submission.id, this.tempResponse);
    }

    export default {
        name: "modal",
        props: {
            submission: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                tempResponse: ""
            }
        },
        methods: {
            respond: respond
        }
    }
</script>
