<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    created() {
        this.$store.commit("spinner", false);
        let to = { name: "index", query: {} };
        let path = window.location.hash.replace("#", "");
        if (path.match("/login")) {
            to.query.path = decodeURIComponent(path.replace("/login?path=", ""));
        } else if (path.match("/index")) {
            to.query.path = decodeURIComponent(path.replace("/index?path=", ""));
        } else {
            to.query.path = decodeURIComponent(path);
        }
        window.intercept = true;
        this.$router.replace(to);
    },
    methods: {},
    computed: {
        spinner() {
            return this.$store.state.spinner;
        },
        loading() {
            return this.$store.state.loading;
        },
    }
};
</script>
<style lang="less">
.app {
    height: 100%;
}
</style>