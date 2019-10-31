<template>
  <div class="card border-secondary h-100">
    <div class="card-header">{{ title }}</div>
    <div class="card-body">
      <div v-if="typeof info === 'string'">
        <p class="card-text">{{ info }}</p>
      </div>
      <div v-if="typeof info === 'object'">
        <div v-for="el in info" :key="el">
          <p class="card-text">{{ el }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardInfo",
  props: {
    info: [String, Array],
    title: String
  }
};
</script>
