import React, {useEffect, useState} from 'react';
import AuthModal from '../../../../components/Modal/authModal';
import {connector} from '../../../../connector';
import Wallet from '../../../../components/Wallet'

const LoginFragment = (props) => {

    const [modalActive, setModalActive] = useState();

    useEffect(() => {
        if (modalActive && props.wallet === null) {
          document.body.classList.add('modal-blocked');
        } else {
          document.body.classList.remove('modal-blocked');
        }
    }, [modalActive, props.wallet]);


    const openModal = (walletName, bridgeUrl, universalLink) => {
        setModalActive(true);
        props.setWallet(walletName);
        props.setWalletConnectionUrl(connector.connect({ bridgeUrl, universalLink }));
    };
        

    const walletElements = props.walletList.map(wallet => 
        <Wallet
            key={wallet.name}
            name={wallet.name}
            bridgeUrl={wallet.bridgeUrl}
            universalLink={wallet.universalLink}
            openModal={openModal}
        />
    );

    return (
        <>
            <div className="auth">
                <div className="auth-container">
                    <div className="auth-title">
                        <h2>Подключите кошелек</h2>
                    </div>
                    <div className="auth-wallet">
                        <div className="auth-description">
                            <span>Для того чтобы использовать наш сервис микроблогов, Вам необходимо скачать и установить один из кошельков, взаимодействующих с блокчейном The Open Network в App Store или Google Play.</span>
                        </div>
                        <div className="auth-wallet-button-items">
                            {walletElements}
                        </div>
                        <div className="auth-privacy">
                            <span>Начиная пользоваться нашим сервисом вы принимаете Условия использования</span>
                        </div>
                    </div>
                </div>
            </div>
            {modalActive ? (
                <AuthModal setModalActive={setModalActive}
                setWalletName={props.setWalletName}
                walletConnectionUrl={props.walletConnectionUrl}
                />
            ) : (
                ''
            )}
            
        </>
    );
}

export default LoginFragment;