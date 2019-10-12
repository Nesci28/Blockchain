<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <router-link class="logo-aperture navbar-brand" to="/">
      <ApertureLogo class="mr-2"></ApertureLogo>Explorer
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarColor01"
      aria-controls="navbarColor01"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/blockchain">Blockchain</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/search/block">Block</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/search/transaction">Transaction</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/search/address">Address</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import ApertureLogo from "./ApertureLogo.vue";

export default {
  components: {
    ApertureLogo
  }
};
</script>

<style lang="scss">
.logo-aperture {
  fill: #fff;
  &:hover {
    fill: #333;
  }
}
</style>

