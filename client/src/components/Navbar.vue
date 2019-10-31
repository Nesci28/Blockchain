<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      :class="{ 'small-navbar': checkForPresentation() }"
      class="navbar-background"
    >
      <b-navbar-brand to="/" class="logo-aperture">
        <ApertureLogo class="mr-2"></ApertureLogo>Explorer
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/presentation">
            <font-awesome-icon icon="file-powerpoint" size="lg" />&nbsp;Presentation
          </b-nav-item>
          <b-nav-item to="/laboratory">
            <font-awesome-icon icon="flask" size="lg" />&nbsp;Laboratory
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/blockchain">
            <font-awesome-icon icon="link" size="lg" />&nbsp;Blockchain
          </b-nav-item>
          <b-nav-item to="/search/block">
            <font-awesome-icon icon="unlink" size="lg" />&nbsp;Block
          </b-nav-item>
          <b-nav-item to="/search/transaction">
            <font-awesome-icon icon="dice-d20" size="lg" />&nbsp;Transaction
          </b-nav-item>
          <b-nav-item to="/search/address">
            <font-awesome-icon icon="address-card" size="lg" />&nbsp;Address
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import ApertureLogo from "./ApertureLogo.vue";

export default {
  components: {
    ApertureLogo
  },
  methods: {
    checkForPresentation() {
      if (
        this.$route.name === "presentation" ||
        this.$route.name === "laboratory"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
.navbar-background {
  background-color: #375a7f !important;
}
.logo-aperture {
  fill: #fff;
  &:hover {
    fill: #333;
  }
}
.small-navbar {
  padding: 0 !important;
  a {
    padding: 0;
  }
}
</style>
