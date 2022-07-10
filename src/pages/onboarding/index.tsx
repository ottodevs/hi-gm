import { providers } from 'ethers';
import { NextPage } from 'next';
import { useCallback, useEffect, useReducer } from 'react';
import Web3Modal from 'web3modal';

import { providerOptions } from '../../lib/providerOptions';
import { getChainData } from '../../lib/utilities';
import styles from '../../styles/Onboarding.module.css';

let web3Modal;
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
    });
}

interface StateType {
    provider?: any;
    web3Provider?: any;
    address?: string;
    chainId?: number;
}

type ActionType =
    | {
          type: 'SET_WEB3_PROVIDER';
          provider?: StateType['provider'];
          web3Provider?: StateType['web3Provider'];
          address?: StateType['address'];
          chainId?: StateType['chainId'];
      }
    | {
          type: 'SET_ADDRESS';
          address?: StateType['address'];
      }
    | {
          type: 'SET_CHAIN_ID';
          chainId?: StateType['chainId'];
      }
    | {
          type: 'RESET_WEB3_PROVIDER';
      };

const initialState: StateType = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
};

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case 'SET_WEB3_PROVIDER':
            return {
                ...state,
                provider: action.provider,
                web3Provider: action.web3Provider,
                address: action.address,
                chainId: action.chainId,
            };
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.address,
            };
        case 'SET_CHAIN_ID':
            return {
                ...state,
                chainId: action.chainId,
            };
        case 'RESET_WEB3_PROVIDER':
            return initialState;
        default:
            throw new Error();
    }
}

const Onboarding: NextPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { provider, web3Provider, address, chainId } = state;

    const connect = useCallback(async function () {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const provider = await web3Modal.connect();

        // We plug the initial `provider` into ethers.js and get back
        // a Web3Provider. This will add on methods from ethers.js and
        // event listeners such as `.on()` will be different.
        const web3Provider = new providers.Web3Provider(provider);

        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        const network = await web3Provider.getNetwork();

        dispatch({
            type: 'SET_WEB3_PROVIDER',
            provider,
            web3Provider,
            address,
            chainId: network.chainId,
        });
    }, []);

    const disconnect = useCallback(
        async function () {
            await web3Modal.clearCachedProvider();
            if (provider?.disconnect && typeof provider.disconnect === 'function') {
                await provider.disconnect();
            }
            dispatch({
                type: 'RESET_WEB3_PROVIDER',
            });
        },
        [provider]
    );

    // Auto connect to the cached provider
    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connect();
        }
    }, [connect]);

    // A `provider` should come with EIP-1193 events. We'll listen for those events
    // here so that when a user switches accounts or networks, we can update the
    // local React state with that new information.
    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                // eslint-disable-next-line no-console
                console.log('accountsChanged', accounts);
                dispatch({
                    type: 'SET_ADDRESS',
                    address: accounts[0],
                });
            };

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId: string) => {
                window.location.reload();
            };

            const handleDisconnect = (error: { code: number; message: string }) => {
                // eslint-disable-next-line no-console
                console.log('disconnect', error);
                disconnect();
            };

            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', handleChainChanged);
            provider.on('disconnect', handleDisconnect);

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountsChanged', handleAccountsChanged);
                    provider.removeListener('chainChanged', handleChainChanged);
                    provider.removeListener('disconnect', handleDisconnect);
                }
            };
        }
    }, [provider, disconnect]);

    const chainData = getChainData(chainId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {web3Provider && <div onClick={disconnect}>Disconnect</div>}
            <div style={{ display: 'flex' }}>
                <p className={styles.paginator_number}>1/2</p>
                <p className={styles.paginator_action}>Next</p>
            </div>
            <h1 className={styles.header}>Connect with wallet</h1>
            <p className={styles.subheader}>
                You can setup your account from over 100 of the most popular wallets. Proving your identity through a
                wallet helps increase the trust in our decentralised platform.
            </p>
            <div>
                <div
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', color: '#fff' }} onClick={connect}>
                        <div style={{ width: '100px', height: '100px' }}>Icon</div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: '1',
                                width: '100px',
                                height: '100px',
                            }}
                        >
                            <div>Title</div>
                            <div>status</div>
                        </div>
                        <div style={{ width: '100px', height: '100px' }}>Check</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
