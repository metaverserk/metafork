import { toUserFriendlyAddress } from '@tonconnect/sdk';

export const userFriendlyAddress = (wallet) => {
    const userFriendlyAddress = wallet ? toUserFriendlyAddress(wallet) : '';
    return userFriendlyAddress.slice(0, 4) + '…' + userFriendlyAddress.slice(-4);

}

export const userFriendlyAddressFull = (wallet) => {
    const userFriendlyAddress = wallet ? toUserFriendlyAddress(wallet) : '';
    return userFriendlyAddress;

}