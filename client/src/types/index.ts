export interface Transaction {
    gasLimit: string;
    gasPrice: string;
    to: string;
    from: string;
    value: string;
    data?: string;
    chainId: string;
    hash: string;
}

export interface TransactionsData {
    getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
    getTransaction: Transaction;
}

export type Action<P> = {
    type: Actions;
    payload: P;
};
export interface SendTransactionPayload {
    sender: string;
    recipient: string;
    amount: string;
}
export enum Actions {
    SendTransaction = 'SEND_TRANSACTION',
    SetTransactionId = 'SET_TRANSACTION_ID',
    SetTransactionStatus = 'SET_TRANSACTION_STATUS',
    SetWalletAddress = 'SET_WALLET_ADDRESS',
}
