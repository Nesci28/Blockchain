<template #rthrth>
  <div>
    <FlashMessage v-if="timer" :classType="classType" :msg="msg"></FlashMessage>
    <form @submit.prevent="search()">
      <!-- Block -->
      <div v-if="url === 'block'" class="form-group row mb-5 mx-auto">
        <label for="block" class="col-sm-1 col-form-label">Block:</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" v-model="blockId" placeholder="Hash, Index" />
        </div>
        <div class="col-sm-1">
          <button v-on:click="getBlock(blockId)" class="btn btn-primary">Send</button>
        </div>
      </div>

      <!-- Transactions -->
      <div v-if="url === 'transaction'" class="form-group row mb-5 mx-auto">
        <label for="block" class="col-sm-1 col-form-label">Transaction:</label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            v-model="transactionId"
            placeholder="Transaction ID"
          />
        </div>
        <div class="col-sm-1">
          <button v-on:click="getTransaction(transactionId)" class="btn btn-primary">Send</button>
        </div>
      </div>

      <!-- Address -->
      <div v-if="url === 'address'" class="form-group row mb-5 mx-auto">
        <label for="block" class="col-sm-1 col-form-label">Address:</label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            v-model="addressId"
            placeholder="Sender, Recipient"
          />
        </div>
        <div class="col-sm-1">
          <button v-on:click="getAddress(addressId)" class="btn btn-primary">Send</button>
        </div>
      </div>
    </form>

    <div v-if="block" class="mb-5">
      <h3>Block:</h3>
      <TableBlock :blocks="block"></TableBlock>
    </div>
    <div v-if="balance" class="row">
      <div class="col-lg-9"></div>
      <div class="col-lg-3">
        <CardInfo title="Balance" :info="balance.toString()"></CardInfo>
      </div>
    </div>

    <div v-if="transactions">
      <h3>Transactions:</h3>
      <TableTransactions :transactions="transactions"></TableTransactions>
    </div>
  </div>
</template>

<script>
import FlashMessage from "../components/FlashMessage.vue";
import TableBlock from "../components/TableBlock.vue";
import TableTransactions from "../components/TableTransactions.vue";
import CardInfo from "../components/CardInfo.vue";
const axios = require("axios");

export default {
  name: "block",
  components: {
    FlashMessage,
    TableBlock,
    TableTransactions,
    CardInfo
  },
  data() {
    return {
      blockId: null,
      transactionId: null,
      addressId: null,
      block: null,
      transactions: null,
      address: null,
      classType: null,
      timer: false,
      setTimer: null,
      url: null,
      balance: null
    };
  },
  mounted() {
    this.url = this.$route.params.id;
  },
  watch: {
    $route() {
      clearTimeout(this.setTimer);
      this.timer = false;
      this.url = this.$route.params.id;
      this.block = null;
      this.transactions = null;
      this.address = null;
      this.blockId = null;
      this.transactionId = null;
      this.addressId = null;
      this.balance = null;
    }
  },
  methods: {
    search() {
      if (this.blockId) {
        this.getBlock(this.blockId);
      }
      if (this.transactionId) {
        this.getTransaction(this.transactionId);
      }
      if (this.addressId) {
        this.getAddress(this.addressId);
      }
    },
    getBlock(blockId) {
      clearTimeout(this.setTimer);
      if (blockId !== null) {
        axios
          .get(
            `https://blockchain-lab-explorer-server.now.sh/api/block/${blockId}`
          )
          .then(data => {
            if (data.data.block) {
              this.block = [data.data.block];
              this.transactions = data.data.block.transactions;
            } else {
              clearTimeout(this.setTimer);
              this.block = null;
              this.transaction = null;
              this.address = null;
              this.classType = "danger";
              this.msg = "Aucun Block trouvé";
              this.timer = true;
              this.setTimer = setTimeout(() => {
                this.timer = false;
              }, 4000);
            }
          });
      } else {
        this.showWarning();
      }
    },
    getTransaction(transactionId) {
      clearTimeout(this.setTimer);
      if (transactionId !== null) {
        axios
          .get(
            `https://blockchain-lab-explorer-server.now.sh/api/transaction/${transactionId}`
          )
          .then(data => {
            if (data.data.transaction) {
              this.block = [data.data.transaction.block];
              this.transactions = [data.data.transaction.transaction];
            } else {
              clearTimeout(this.setTimer);
              this.block = null;
              this.transaction = null;
              this.address = null;
              this.classType = "danger";
              this.msg = "Aucune Transaction trouvée";
              this.timer = true;
              this.setTimer = setTimeout(() => {
                this.timer = false;
              }, 4000);
            }
          });
      } else {
        this.showWarning();
      }
    },
    getAddress(addressId) {
      clearTimeout(this.setTimer);
      if (addressId !== null) {
        axios
          .get(
            `https://blockchain-lab-explorer-server.now.sh/api/address/${addressId}`
          )
          .then(data => {
            if (data.data.addressTransactions.length > 0) {
              this.balance = data.data.balance;
              this.transactions = data.data.addressTransactions;
            } else {
              clearTimeout(this.setTimer);
              this.block = null;
              this.transaction = null;
              this.address = null;
              this.classType = "danger";
              this.msg = "Aucun information avec cette Address trouvé";
              this.timer = true;
              this.setTimer = setTimeout(() => {
                this.timer = false;
              }, 4000);
            }
          });
      } else {
        this.showWarning();
      }
    },
    showWarning() {
      clearTimeout(this.setTimer);
      this.classType = "warning";
      this.msg = "Aucune information entrée";
      this.timer = true;
      this.setTimer = setTimeout(() => {
        this.timer = false;
      }, 4000);
    }
  }
};
</script>
