<template>
  <div>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <object data="https://blockchain-lab.now.sh" :width="width" :height="height" type="text/html"></object>
      <button type="button" @click="toggle" class="btn btn-primary button-position-fullscreen">
        <font-awesome-icon v-if="!fullscreen" icon="arrows-alt" size="lg" />
        <font-awesome-icon v-if="fullscreen" icon="compress-arrows-alt" size="lg" />
      </button>
    </fullscreen>
  </div>
</template>

<script>
export default {
  name: "laboratory",
  data() {
    return {
      width: null,
      height: null,
      fullscreen: false
    };
  },
  methods: {
    size() {
      if (!this.fullscreen) {
        this.width = window.innerWidth;
        this.height = window.innerHeight - 36.3;
      } else {
        this.width = "100%";
        this.height = "99%";
      }
    },
    toggle() {
      this.$refs["fullscreen"].toggle();
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
      this.size();
    }
  },
  created() {
    window.addEventListener("resize", this.size);
    this.size();
  },
  destroyed() {
    window.removeEventListener("resize", this.size);
  }
};
</script>

<style lang="scss">
.button-position-fullscreen {
  position: absolute;
  top: calc(100% - 40px);
  left: calc(100% - 50px);
}
</style>
