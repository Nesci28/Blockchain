<template>
  <div>
    <FlashMessage v-if="timer" :classType="classType" :msg="msg"></FlashMessage>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Index</th>
          <th scope="col">Timestamp</th>
          <th scope="col">Nonce</th>
          <th scope="col">Hash</th>
          <th scope="col">Previous Hash</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(block, index) in blocks"
          :key="JSON.stringify(block)"
          :class="{ 'table-primary': index % 2 === 0, 'table-secondary': index % 2 !== 0 }"
        >
          <td :title="block.index" data-trigger="hover">{{ block.index }}</td>
          <td :title="block.timestamp" data-trigger="hover">{{ block.timestamp }}</td>
          <td :title="block.nonce" data-trigger="hover">{{ block.nonce }}</td>
          <td :title="block.hash" data-trigger="hover">
            <div v-clipboard="block.hash">
              {{ block.hash.substring(0, 15) }}...
              <font-awesome-icon @click="copy()" class="pointer" icon="clipboard" />
            </div>
          </td>
          <td :title="block.previousBlockHash" data-trigger="hover">
            <div v-clipboard="block.previousBlockHash">
              {{ block.hash.substring(0, 15) }}...
              <font-awesome-icon @click="copy()" class="pointer" icon="clipboard" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FlashMessage from "../components/FlashMessage.vue";

export default {
  name: "TableBlock",
  components: {
    FlashMessage
  },
  props: {
    blocks: Array
  },
  data() {
    return {
      classType: null,
      timer: false,
      setTimer: null
    };
  },
  methods: {
    copy() {
      this.classType = "success";
      this.msg = "Valeur copier dans le Clipboard!";
      this.timer = true;
      this.setTimer = setTimeout(() => {
        this.timer = false;
      }, 4000);
    }
  }
};
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>