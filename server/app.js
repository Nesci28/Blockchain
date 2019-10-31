const express = require('express');
const cors = require('cors');
const db = require('monk')(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds233288.mlab.com:33288/blockchain-presentation`,
);
blockchainDB = db.get('blockchain');

const app = express();
app.use(
  cors({
    origin: ['https://learn-blockchain.now.sh', 'http://localhost:8080'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/blockchain', async (_, res) => {
  let blk = await blockchainDB.find({
    currentNodeUrl: 'http://localhost:3001',
  });
  let timestamp = 0;
  blk.forEach(chain => {
    if (chain.chain[0].timestamp > timestamp) {
      timestamp = chain.chain[0].timestamp;
      blk = chain;
    }
  });
  db.close();
  res.send(blk);
});

app.get('/api/block/:blockHash', async (req, res) => {
  const blockHash = req.params.blockHash;
  let block;
  let blk = await blockchainDB.find({
    currentNodeUrl: 'http://localhost:3001',
  });
  let timestamp = 0;
  blk.forEach(chain => {
    if (chain.chain[0].timestamp > timestamp) {
      timestamp = chain.chain[0].timestamp;
      blk = chain;
    }
  });
  for (const bl of blk.chain) {
    if (bl.index === +blockHash || bl.hash === blockHash) {
      block = bl;
      break;
    }
  }
  db.close();
  res.json({
    block,
  });
});

app.get('/api/transaction/:transactionId', async (req, res) => {
  const transactionId = req.params.transactionId;
  let transaction = {
    block: null,
    transaction: null,
  };
  let blk = await blockchainDB.find({
    currentNodeUrl: 'http://localhost:3001',
  });
  let timestamp = 0;
  blk.forEach(chain => {
    if (chain.chain[0].timestamp > timestamp) {
      timestamp = chain.chain[0].timestamp;
      blk = chain;
    }
  });
  for (const bl of blk.chain) {
    for (const tx of bl.transactions) {
      if (tx.transactionId === transactionId) {
        transaction.block = bl;
        transaction.transaction = tx;
        break;
      }
    }
  }
  db.close();
  res.json({
    transaction,
  });
});

app.get('/api/address/:address', async (req, res) => {
  const address = req.params.address;
  let addressData = {
    addressTransactions: [],
    balance: null,
  };
  let blk = await blockchainDB.find({
    currentNodeUrl: 'http://localhost:3001',
  });
  let timestamp = 0;
  blk.forEach(chain => {
    if (chain.chain[0].timestamp > timestamp) {
      timestamp = chain.chain[0].timestamp;
      blk = chain;
    }
  });
  for (const bl of blk.chain) {
    for (const tx of bl.transactions) {
      if (tx.sender === address || tx.recipient === address) {
        addressData.addressTransactions.push(tx);
        tx.sender === address
          ? (addressData.balance -= tx.amount)
          : (addressData.balance += tx.amount);
      }
    }
  }
  db.close();
  res.json(addressData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
