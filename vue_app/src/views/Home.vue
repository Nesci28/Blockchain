<template>
  <div class="home">
    <Aperture class="image-aperture"></Aperture>
  </div>
</template>

<script>
import Aperture from "../components/Aperture.vue";

export default {
  name: "home",
  components: {
    Aperture
  }
};
</script>

<style lang="scss">
.image-aperture {
  fill: #375a7f;
  &:hover {
    fill: #fff;
  }
}
</style>
