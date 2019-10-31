const express = require('express');
const cors = require('cors');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const db = require('monk')(
  'mongodb://CGI_nesci:012Qpalzm012@ds233288.mlab.com:33288/blockchain-presentation',
);

const Blockchain = require('./blockchain');

const port = process.argv[2];

let nodeAddres;
let blk;
let id;

(async () => {
  blockchainDB = db.get('blockchain');
  nodeAddress = uuid().replace(/-/g, '');
  blk = new Blockchain();
  console.log(blockchainDB, blk);
  id = await blockchainDB.insert(blk);
  id = id._id;
  console.log('id :', id);
})();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/blockchain', (_, res) => {
  res.send(blk);
});

app.get('/mine', (_, res) => {
  const lastBlock = blk.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: blk.pendingTransactions,
    index: lastBlock.index + 1,
  };

  const nonce = blk.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = blk.hashBlock(previousBlockHash, currentBlockData, nonce);

  const newBlock = blk.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  blk.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises)
    .then(_ => {
      const requestOptions = {
        uri: blk.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
          amount: 12.5,
          sender: 'Mining',
          recipient: nodeAddress,
        },
        json: true,
      };

      return rp(requestOptions);
    })
    .then(async _ => {
      await blockchainDB.findOneAndUpdate(
        { _id: id },
        { $push: { chain: newBlock } },
      );
      await blockchainDB.findOneAndUpdate(
        { _id: id },
        { $set: { pendingTransactions: [] } },
      );
      res.json({
        note: 'New block mined successfully',
        block: newBlock,
      });
    });
});

app.get('/consensus', (_, res) => {
  const requestPromises = [];
  blk.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(blockchains => {
    const currentChainLength = blk.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !blk.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: 'Current chain has not been replaced',
        chain: blk.chain,
      });
    } else if (newLongestChain && blk.chainIsValid(newLongestChain)) {
      blk.chain = newLongestChain;
      blk.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced',
        chain: blk.chain,
      });
    }
  });
});

app.post('/receive-new-block', (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = blk.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock.index + 1 === newBlock.index;

  if (correctHash && correctIndex) {
    blk.chain.push(newBlock);
    blk.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted',
      newBlock,
    });
  } else {
    res.json({
      note: 'New block rejected',
      newBlock,
    });
  }
});

app.post('/transaction', (req, res) => {
  const blockIndex = blk.addTransactionToPendindTransactions(req.body);
  res.json({
    note: `Transaction will be added in block ${blockIndex}`,
  });
});

app.post('/transaction/broadcast', (req, res) => {
  const newTransaction = blk.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );
  blk.addTransactionToPendindTransactions(newTransaction);

  const requestPromises = [];
  blk.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(async _ => {
    await blockchainDB.findOneAndUpdate(
      { _id: id },
      { $push: { pendingTransactions: newTransaction } },
    );
    res.json({
      note: 'Transaction created and broadcast sucessfully',
    });
  });
});

app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (blk.networkNodes.indexOf(newNodeUrl) === -1)
    blk.networkNodes.push(newNodeUrl);

  const registerNodesPromises = [];
  blk.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    registerNodesPromises.push(rp(requestOptions));
  });

  Promise.all(registerNodesPromises)
    .then(_ => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [...blk.networkNodes, blk.currentNodeUrl] },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then(async _ => {
      console.log(id);
      await blockchainDB.findOneAndUpdate(
        { _id: id },
        { $push: { networkNodes: newNodeUrl } },
      );
      res.json({
        note: 'New node registered with network succesfully',
      });
    });
});

app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (
    blk.networkNodes.indexOf(newNodeUrl) === -1 &&
    blk.currentNodeUrl !== newNodeUrl
  )
    blk.networkNodes.push(newNodeUrl);
  res.json({
    note: 'New node registered successfully',
  });
});

app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    if (
      blk.networkNodes.indexOf(networkNodeUrl) === -1 &&
      networkNodeUrl !== blk.currentNodeUrl
    ) {
      blk.networkNodes.push(networkNodeUrl);
    }
  });
  res.json({
    note: 'Bulk registation succesful',
  });
});

app.get('/block/:blockHash', (req, res) => {
  const blockHash = req.params.blockHash;
  const block = blk.getBlock(blockHash);
  res.json({
    block,
  });
});

app.get('/transaction/:transactionId', (req, res) => {
  const transactionId = req.params.transactionId;
  const transaction = blk.getTransaction(transactionId);
  res.json(transaction);
});

app.get('/address/:address', (req, res) => {
  const address = req.params.address;
  const addressData = blk.getAddressData(address);
  res.json(addressData);
});

app.get('/block-explorer', (_, res) => {
  res.sendFile('./dist/index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
