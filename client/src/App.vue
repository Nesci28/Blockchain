<template>
  <div id="app">
    <NavBar :class="{ 'mb-4': checkForIFrame() }"></NavBar>
    <div :class="{ container: checkForIFrame() }">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from "./components/Navbar.vue";

export default {
  data() {
    return {};
  },
  components: {
    NavBar
  },
  methods: {
    checkForIFrame() {
      return this.$route.name === "presentation" ||
        this.$route.name === "laboratory" ||
        this.$route.name === "notFound"
        ? false
        : true;
    }
  }
};
</script>

<style src='./assets/bootstrap.min.css'>
</style> 

