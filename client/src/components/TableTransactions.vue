<template>
  <div>
    <FlashMessage v-if="timer" :classType="classType" :msg="msg"></FlashMessage>
    <table v-if="transactions.length > 0" class="table table-hover">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Sender</th>
          <th scope="col">Recipient</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(transaction, index) in transactions"
          :key="index"
          v-bind:class="{
            'table-primary': index % 2 === 0,
            'table-secondary': index % 2 !== 0
          }"
        >
          <td :title="transaction.transactionId" data-trigger="hover">
            <div v-clipboard="transaction.transactionId">
              {{ transaction.transactionId.substring(0, 15) }}...
              <font-awesome-icon
                @click="copy()"
                class="pointer"
                icon="clipboard"
              />
            </div>
          </td>
          <td>{{ transaction.sender }}</td>
          <td>{{ transaction.recipient }}</td>
          <td>{{ transaction.amount }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Aucune transactions dans ce Block</div>
  </div>
</template>

<script>
import FlashMessage from "../components/FlashMessage.vue";

export default {
  name: "TableTransactions",
  components: {
    FlashMessage
  },
  props: {
    transactions: Array
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
