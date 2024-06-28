import { ethers } from 'ethers';

class SongProtocolClient {
    constructor(rpcUrl, copyrightAddress) {

        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        this.copyrightContract = new ethers.Contract(
            copyrightAddress,
            [
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
            ],
            this.provider
        );
    }

    async createAccount() {
        const account = ethers.Wallet.createRandom();
        return account;
    }

    async getBalance(address) {
        const balance = this.provider.getBalance(address);
        return balance;
    }

    async sendTransaction(privateKey, toAddress, nativeTokenAmount, data) {

        const wallet = new ethers.Wallet(privateKey, this.provider);

        const dataUtf8Bytes = ethers.toUtf8Bytes(data);
        const dataHexString = ethers.hexlify(dataUtf8Bytes);

        let options = {
            to: toAddress,
            value: nativeTokenAmount,
            data: dataHexString,
            gasPrice: (await this.provider.getFeeData()).gasPrice,
        };

        const transactionResponse = await wallet.sendTransaction(options);
        const txReceipt = await transactionResponse.wait();

        return txReceipt;
    }

    async copyrightRegister(privateKey, uri, name, addresses, shares) {

        const wallet = new ethers.Wallet(privateKey, this.provider);

        const contractWithSigner = this.copyrightContract.connect(wallet);

        const transaction = await contractWithSigner.mint(uri, name, addresses, shares);

        const txReceipt = await transaction.wait();

        return txReceipt;
    }
}

export default SongProtocolClient;
