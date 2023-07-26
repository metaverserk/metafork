import TonConnect from '@tonconnect/sdk';

export const connector = new TonConnect({
    manifestUrl: 'https://metafork.io/tonconnect-manifest.json'
});

export const isConnectionRestored = connector.restoreConnection();