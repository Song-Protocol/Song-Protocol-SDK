import SongProtocolClient from '../src/songProtocolClient.js';

const client = new SongProtocolClient('https://testnet-rpc.songprotocol.org');

const testAddress = '0x12C5CaA7615FC16D3326e6C3083dc55AFF8D68b9';
const testPrivateKey = '0xaf4f3045c8e0706d7c8516c5e865a5f0621c6745c53394e5d18d508cdc29eccd';

test('it should create account', async () => {
    const account = await client.createAccount();
    console.log(account);
});

test('it should get balance', async () => {
    const balance = await client.getBalance(testAddress);
    console.log(balance);
});

test('it should send transaction', async () => {
    const txReceipt = await client.sendTransaction(testPrivateKey, testAddress, 0, 'Hello World');
    console.log(txReceipt);

    // You can see transaction here: https://testnet-explorer.songprotocol.org/tx/{$transactionHash}
    // ex. https://testnet-explorer.songprotocol.org/tx/0x24cafcb9529b19d18d9d032adfcf06778f9e6f13e1d5a090802c353e78225221
});