<template>
  <div id="app">
    <NavBar class="mb-4"></NavBar>
    <div class="container">
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
  }
};
</script>
