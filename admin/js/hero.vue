<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">{{ title }}</h1>
                <h2 class="subtitle">Manage submissions</h2>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'hero',
        props: {
            title: {
                required: true
            }
        }
    }
</script>
