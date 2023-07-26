import React from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';

const AuthModal = ({
        setModalActive,
        setWalletName,
        walletConnectionUrl
    }) => {

    let closeModal = () => {
        setModalActive(false);
    }


    return (
        <>
            <div className="modal">
                <div className="modal-container">
                    <div className="modal-closed" onClick={closeModal}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2785 6.29537C16.6723 5.90154 17.3108 5.90154 17.7046 6.29537C18.0985 6.68919 18.0985 7.3277 17.7046 7.72152L7.72156 17.7046C7.32774 18.0984 6.68923 18.0984 6.29541 17.7046C5.90159 17.3108 5.90159 16.6723 6.29541 16.2785L16.2785 6.29537Z" fill="white"></path><path d="M6.29537 7.72153C5.90154 7.32771 5.90154 6.6892 6.29537 6.29537C6.68919 5.90155 7.3277 5.90155 7.72152 6.29537L17.7046 16.2785C18.0984 16.6723 18.0984 17.3108 17.7046 17.7046C17.3108 18.0985 16.6723 18.0985 16.2784 17.7046L6.29537 7.72153Z" fill="white"></path></svg>
                    </div>
                    <div className="modal-header">
                        <div className="modal-title">
                            <h2>Вход через {setWalletName}</h2>
                        </div>
                    </div>
                    <div className="modal-content">
                        <div className="modal-qr">
                            <div className="modal-qr-image">
                                <QRCode value={walletConnectionUrl}/>
                            </div>
                            <div className="modal-guide">
                                <div className="modal-guide-item">
                                    <div className="modal-guide-point">
                                        <span>1</span>
                                    </div>
                                    <div className="modal-guide-text">
                                        <p>Откройте приложение {setWalletName}. Если у вас нет этого приложения, скачайте его с <a href="https://tonkeeper.com/download/" target="_blank">официального сайта</a></p>
                                    </div>
                                </div>
                                <div className="modal-guide-item">
                                    <div className="modal-guide-point">
                                        <span>2</span>
                                    </div>
                                    <div className="modal-guide-text">
                                        <p>Нажмите на кнопку открыть {setWalletName} и подключите свой кошелек:</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-app">
                            <div className="modal-guide">
                                <div className="modal-guide-item">
                                    <div className="modal-guide-point">
                                        <span>1</span>
                                    </div>
                                    <div className="modal-guide-text">
                                        <p>Откройте приложение {setWalletName}. Если у вас нет этого приложения, скачайте его с <a href="https://tonkeeper.com/download/" target="_blank">официального сайта</a></p>
                                    </div>
                                </div>
                                <div className="modal-guide-item">
                                    <div className="modal-guide-point">
                                        <span>2</span>
                                    </div>
                                    <div className="modal-guide-text">
                                        <p>Нажмите на кнопку открыть {setWalletName} и подключите свой кошелек:</p>
                                    </div>
                                </div>
                                <div className="modal-button">
                                    <Link to={walletConnectionUrl} className="button" target="_blank" >Открыть {setWalletName}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-overlay" onClick={closeModal}></div>
        </>
    );
}

export default AuthModal;