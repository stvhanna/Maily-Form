<template>
    <div class="tabs">
        <ul>
            <li v-bind:class="{'is-active':($root.selector === 'sent')}">
                <a @click="$root.selector='sent'">Sent</a>
            </li>
            <li v-bind:class="{'is-active':($root.selector === 'spam')}">
                <a @click="$root.selector='spam'">Spam</a>
            </li>
            <li v-bind:class="{'is-active':($root.selector === 'archive')}">
                <a @click="$root.selector='archive'">Archive</a>
            </li>
        </ul>
    </div>
</template>
