const sha256 = require('sha256');
const uuid = require('uuid/v1');

const currentNodeUrl = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(0, 'Genesis', 'Genesis');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash,
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient,
) {
  const newTransaction = {
    amount,
    sender,
    recipient,
    transactionId: uuid().replace(/-/g, ''),
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendindTransactions = function(
  transactionObj,
) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock().index + 1;
};

Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce,
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData,
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
};

Blockchain.prototype.chainIsValid = function(blockchain) {
  const genesisBlock = blockchain[0];
  if (
    genesisBlock.nonce !== 0 ||
    genesisBlock.previousBlockHash !== 'Genesis' ||
    genesisBlock.hash !== 'Genesis' ||
    genesisBlock.transactions.length !== 0
  )
    return false;

  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];
    const blockHash = this.hashBlock(
      previousBlock.hash,
      { transactions: currentBlock.transactions, index: currentBlock.index },
      currentBlock.nonce,
    );
    if (blockHash.substring(0, 4) !== '0000') return false;
    if (currentBlock.previousBlockHash !== previousBlock.hash) return false;

    return true;
  }
};

Blockchain.prototype.getBlock = function(blockHash) {
  for (const block of this.chain) {
    if (block.hash === blockHash || +blockHash === block.index) return block;
  }
  return null;
};

Blockchain.prototype.getTransaction = function(transactionId) {
  for (const block of this.chain) {
    for (const transaction of block.transactions) {
      if (transaction.transactionId === transactionId)
        return {
          transaction,
          block,
        };
    }
  }
  return {
    transaction: null,
    block: null,
  };
};

Blockchain.prototype.getAddressData = function(address) {
  const addressTransactions = [];
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address || transaction.recipient === address)
        addressTransactions.push(transaction);
    });
  });

  let balance = 0;
  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) balance += transaction.amount;
    else balance -= transaction.amount;
  });

  return {
    addressTransactions,
    balance,
  };
};

module.exports = Blockchain;
