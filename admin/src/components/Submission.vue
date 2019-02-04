<template>
    <tr>
        <th scope="row">{{ submission.id }}</th>
        <td v-bind:title="submission.time">{{ new Date(submission.time).toLocaleString() }}</td>
        <td>{{ submission.formName }}</td>
        <td>{{ submission.replyTo }}</td>
        <td v-html="submission.text"></td>
        <td>
            <a class="has-text-danger"
               @click="$root.deleteSubmission(submission.id)">Delete </a>
            <a class="has-text-warning"
               @click="$root.archiveSubmission(submission.id)"
               v-if="($route.params.selector !== 'archive')">Archive </a>
            <a class="has-text-warning"
               @click="$root.unarchiveSubmission(submission.id)"
               v-if="($route.params.selector === 'archive')">Unarchive </a>
            <a @click="openModal()">View</a>
            <Modal :submission="submission"></Modal>
        </td>
    </tr>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import {SubmissionModel} from '@/models/submissionModel';

@Component({
    components: {
        Modal,
    },
})
export default class Submission extends Vue {
    @Prop() public submission!: SubmissionModel;

    public openModal(): void {
        this.$router.push({
            name: 'modal',
            params: {
                sid: this.submission.id,
            },
        });
    }
}
</script>
