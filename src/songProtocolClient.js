import { Web3 } from 'web3';

class SongProtocolClient {
    constructor(rpcUrl, copyrightAddress) {
        this.web3 = new Web3(rpcUrl);
        // testnet: https://testnet-rpc.songprotocol.org
        this.web3 = new Web3(rpcUrl);
        this.copyrightContract = new this.web3.eth.Contract([
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "uri_",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "name_",
                        "type": "string"
                    },
                    {
                        "internalType": "address[]",
                        "name": "shareholders",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint16[]",
                        "name": "counts",
                        "type": "uint16[]"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], copyrightAddress);
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

        let options = {
            from: account.address,
            to: toAddress,
            value: nativeTokenAmount,
            data: this.web3.utils.utf8ToHex(data),
            gasPrice: await this.web3.eth.getGasPrice(),
        };

        const signedTransaction = await this.web3.eth.accounts.signTransaction(options, account.privateKey);

        const txReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return txReceipt;
    }

    async copyrightRegister(privateKey, uri, name, addresses, shares) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        const transaction = this.copyrightContract.methods.mint(uri, name, addresses, shares);

        const options = {
            from    : account.address,
            to      : this.copyrightContract._address,
            data    : transaction.encodeABI(),
            gasPrice: await this.web3.eth.getGasPrice(),
        };

        const signedTransaction = await this.web3.eth.accounts.signTransaction(options, account.privateKey);

        const txReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        return txReceipt;
    }
}

export default SongProtocolClient;
