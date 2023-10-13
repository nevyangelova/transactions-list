// Define the state type
export interface RootState {
    transactions: any[];
    transactionId: string | null;
    currentTransactionStatus: 'idle' | 'pending' | 'success' | 'failure';
    walletAddress: string | undefined;
}

interface SetTransactionIdAction {
    type: 'SET_TRANSACTION_ID';
    payload: {transactionId: string};
}

interface SetTransactionStatus {
    type: 'SET_TRANSACTION_STATUS';
    payload: {status: 'idle' | 'pending' | 'success' | 'failure'};
}

interface SetWalletAddress {
    type: 'SET_WALLET_ADDRESS';
    payload: {address: string};
}

// Action types
type ActionTypes =
    | SetTransactionIdAction
    | SetTransactionStatus
    | SetWalletAddress;

// Initial state
const initialState: RootState = {
    transactions: [],
    transactionId: null,
    currentTransactionStatus: 'idle',
    walletAddress: undefined,
};

const reducer = (state = initialState, action: ActionTypes): RootState => {
    switch (action.type) {
        case 'SET_TRANSACTION_ID':
            return {
                ...state,
                transactionId: action.payload.transactionId,
            };
        case 'SET_TRANSACTION_STATUS':
            return {
                ...state,
                currentTransactionStatus: action.payload.status,
            };
        case 'SET_WALLET_ADDRESS':
            return {
                ...state,
                walletAddress: action.payload.address,
            };
        default:
            return state;
    }
};

export default reducer;
