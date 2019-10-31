<template>
  <div>
    <div class="row mb-3">
      <div class="col-lg-6">
        <CardInfo title="Current Node Url" :info="currentNodeUrl"></CardInfo>
      </div>
      <div class="col-lg-6">
        <CardInfo title="Network Nodes Url" :info="networkNodes"></CardInfo>
      </div>
    </div>
    <TableBlock :blocks="blockchain"></TableBlock>
  </div>
</template>

<script>
import CardInfo from "../components/CardInfo.vue";
import TableBlock from "../components/TableBlock.vue";
const axios = require("axios");

export default {
  name: "blockchain",
  components: {
    CardInfo,
    TableBlock
  },
  data() {
    return {
      blockchain: null,
      pendingTransactions: null,
      currentNodeUrl: null,
      networkNodes: null
    };
  },
  methods: {},
  mounted() {
    axios
      .get("https://blockchain-lab-explorer-server.now.sh/api/blockchain")
      .then(data => {
        this.blockchain = data.data.chain;
        this.pendingTransactions = data.data.pendingTransactions;
        this.currentNodeUrl = data.data.currentNodeUrl;
        this.networkNodes = data.data.networkNodes;
      });
  }
};
</script>
