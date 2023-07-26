import React from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';

const PostModal = ({
        setModalActive,
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
                            <h2>Окно</h2>
                        </div>
                    </div>
                    <div className="modal-content">
                        
                    </div>
                </div>
            </div>
            <div className="modal-overlay" onClick={closeModal}></div>
        </>
    );
}

export default PostModal;