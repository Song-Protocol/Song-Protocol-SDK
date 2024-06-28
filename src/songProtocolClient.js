import { Web3 } from 'web3';
import { createPublicClient, http, defineChain } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

class SongProtocolClient {
    constructor(rpcUrl, networkId, copyrightAddress) {
        const songProtocolChain = defineChain({
            id: networkId,
            name: 'Song Protocol',
            rpcUrls: {
                default: {
                  http: [rpcUrl],
                },
            },
        });

        this.viemClient = createPublicClient({
            chain: songProtocolChain,
            transport: http(rpcUrl),
        });

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
        const privateKey = generatePrivateKey();
        const account = privateKeyToAccount(privateKey);
        account.privateKey = privateKey;
        return account;
    }

    async getBalance(address) {
        const balance = await this.viemClient.getBalance({ address });
        return balance;
    }

    async sendTransaction(privateKey, toAddress, nativeTokenAmount, data) {
        const account = privateKeyToAccount(privateKey);

        let options = {
            from: account.address,
            to: toAddress,
            value: nativeTokenAmount,
            data: this.web3.utils.utf8ToHex(data),
            gasPrice: await this.web3.eth.getGasPrice(),
        };

        const signedTransaction = await this.web3.eth.accounts.signTransaction(options, privateKey);

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
