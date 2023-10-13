import {takeEvery, put} from 'redux-saga/effects';
import {
    JsonRpcProvider,
    Transaction,
    TransactionResponse,
    TransactionReceipt,
    BrowserProvider,
    Signer,
    toBigInt,
} from 'ethers';

import apolloClient from '../apollo/client';
import {Action, SendTransactionPayload, Actions} from '../types';
import {SaveTransaction} from '../queries';

// Helper function to create transaction
const createTransaction = (recipient: string, amount: string) => {
    return {
        to: recipient,
        // Bug 3 - Ethers.js expects the value to be passed as a string in wei format. JavaScript is not good at handling large integers.
        // The value should be converted into wei format before sending it in the transaction.
        value: toBigInt(amount),
    };
};

function* sendTransaction(action: Action<SendTransactionPayload>) {
    try {
        const {sender, recipient, amount} = action.payload;
        const provider = new JsonRpcProvider('http://localhost:8545');
        // @ts-ignore
        const walletProvider = new BrowserProvider(window.web3.currentProvider);
        const signer: Signer = yield walletProvider.getSigner();

        // Set transaction status to 'pending'
        yield put({
            type: 'SET_TRANSACTION_STATUS',
            payload: {status: 'pending'},
        });

        const transaction = createTransaction(recipient, amount);

        // Send the transaction
        const txResponse: TransactionResponse = yield signer.sendTransaction(
            transaction
        );
        const response: TransactionReceipt = yield txResponse.wait();
        const receipt: Transaction = yield response.getTransaction();

        // Prepare transaction data for Apollo client
        const variables = {
            transaction: {
                gasLimit:
                    (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
                gasPrice:
                    (receipt.gasPrice && receipt.gasPrice.toString()) || '0',
                to: receipt.to,
                from: receipt.from,
                value: (receipt.value && receipt.value.toString()) || '',
                data: receipt.data || null,
                chainId:
                    (receipt.chainId && receipt.chainId.toString()) || '123456',
                hash: receipt.hash,
            },
        };

        // Set transaction ID and status to 'success' for UI display.
        yield put({
            type: Actions.SetTransactionId,
            payload: {transactionId: receipt.hash},
        });
        yield put({
            type: 'SET_TRANSACTION_STATUS',
            payload: {status: 'success'},
        });

        // Save the transaction using Apollo client
        yield apolloClient.mutate({
            mutation: SaveTransaction,
            variables,
        });
    } catch (error) {
        // Handle any kind of error and set status for UI display.
        console.error('Transaction failed:', error);
        yield put({
            type: 'SET_TRANSACTION_STATUS',
            payload: {status: 'failure'},
        });
    }
}

export function* rootSaga() {
    yield takeEvery(Actions.SendTransaction, sendTransaction);
}
