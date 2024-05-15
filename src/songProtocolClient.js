import { Web3 } from 'web3';

class SongProtocolClient {
    constructor(rpcUrl) {
        this.web3 = new Web3(rpcUrl);
        // testnet: https://testnet-rpc.songprotocol.org
    }

    async createAccount() {
        const account = await this.web3.eth.accounts.create();
        return account;
    }

    async getBalance(address) {
        const balance = await this.web3.eth.getBalance(address);
        return balance;
    }

    async sendTransaction(privateKey, toAddress, nativeTokenAmount, data) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

        let tx = {
            from: account.address,
            to: toAddress,
            value: nativeTokenAmount,
            data: this.web3.utils.utf8ToHex(data),
            gasPrice: await this.web3.eth.getGasPrice(),
        };

        const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, account.privateKey);

        const txReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return txReceipt;
    }
}

export default SongProtocolClient;
