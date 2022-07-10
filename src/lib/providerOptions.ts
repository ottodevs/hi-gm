import { IProviderOptions } from 'web3modal';

export const providerOptions: IProviderOptions = {
    // walletlink: {
    //     package: CoinbaseWalletSDK, // Required
    //     options: {
    //         appName: 'Web 3 Modal Demo', // Required
    //         infuraId: process.env.INFURA_KEY, // Required unless you provide a JSON RPC url; see `rpc` below
    //     },
    // },
    // walletconnect: {
    //     package: WalletConnect, // required
    //     options: {
    //         infuraId: process.env.INFURA_KEY, // required
    //     },
    // },
    ripioPortal: {
        package: '',
        options: {
            infuraId: process.env.INFURA_KEY, // required
        },
    },
};
