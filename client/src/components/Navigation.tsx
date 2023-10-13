import React, {useCallback} from 'react';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

import SendTransaction from './SendTransaction';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from '../types';
import {RootState} from '../store/reducers';

const injected = injectedModule();
// Bug 2 - we need to inject the wallets in order to initialise the Onboard instance.
const onboard = Onboard({
    wallets: [injected],
    chains: [
        {
            id: '123456',
            token: 'ETH',
            label: 'Local Ganache',
            rpcUrl: 'http://localhost:8545',
        },
    ],
});

const Navigation: React.FC = () => {
    const dispatch = useDispatch();

    const wallet = useSelector((state: RootState) => state.walletAddress);

    const handleConnect = useCallback(async () => {
        const wallets = await onboard.connectWallet();
        const [metamaskWallet] = wallets;

        // Dispatch the wallet address to Redux for other components to use
        if (
            metamaskWallet.label === 'MetaMask' &&
            metamaskWallet.accounts[0].address
        ) {
            dispatch({
                type: Actions.SetWalletAddress,
                payload: {address: metamaskWallet.accounts[0].address},
            });
        }
    }, [dispatch]);

    // Fixed the styling issues using tailwind classes
    return (
        <header className='flex flex-wrap sm:flex-nowrap z-50 w-full text-sm py-4 bg-gray-800'>
            <nav className='max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between'>
                <div className='flex items-center justify-between'>
                    <a
                        className='flex-none text-xl font-semibold dark:text-white'
                        href='.'
                    >
                        Transactions List
                    </a>
                </div>
                <div className='hs-collapse py-3 overflow-hidden transition-all duration-300 basis-full grow sm:block'>
                    <div className='flex flex-col sm:gap-2 gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5 truncate'>
                        {wallet && (
                            <>
                                <SendTransaction />
                                <p className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm'>
                                    {wallet}
                                </p>
                            </>
                        )}
                        {!wallet && (
                            <button
                                type='button'
                                onClick={handleConnect}
                                className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm'
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navigation;
