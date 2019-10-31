<template>
  <div class="background-image background-height-size"></div>
</template>

<script>
export default {
  name: "notFound"
};
</script>

<style lang="scss">
.background-image {
  color: #fff;
  background: #333;
  padding: 2rem;
  position: relative;
}

.background-image:before {
  content: "";
  background: url("../assets/half-life.jpg") no-repeat center center/cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}
.background-height-size {
  height: calc(100vh - 83px);
}
</style>
