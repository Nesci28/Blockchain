<template>
  <div>
    <div v-if="classType==='primary'" class="alert alert-primary" role="alert">{{ msg }}</div>
    <div v-if="classType==='success'" class="alert alert-success" role="alert">{{ msg }}</div>
    <div v-if="classType==='danger'" class="alert alert-danger" role="alert">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: "FlashMessage",
  props: {
    classType: String,
    msg: String
  }
};
</script>