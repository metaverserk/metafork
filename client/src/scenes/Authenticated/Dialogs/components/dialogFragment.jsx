import React from 'react';
import DialogItem from './dialogItem';
import Preloader from '../../../../components/Preloader'
import Footer from '../../../../components/Footer';
import { useInfiniteScroll } from '../../../../utils';

const DialogFragment = ({
        dialogsData,
        isFetching,
        addPageBackend,
        currentPage,
        pages,
    }) => {


    let dialogElements = dialogsData.map(dialog => 
        <DialogItem
            id={dialog.id}
            key={dialog.id}
            userId={dialog.userId}
            userName={dialog.userName}
            userVerify={dialog.userVerify}
            userAvatar={dialog.userAvatar}
            userAvatarType={dialog.userAvatarType}
            userWallet={dialog.userWallet}
            lastMessage={dialog.lastMessage}
            lastDate={dialog.lastDate}
            unreadMessages={dialog.unreadMessages}
        />
    );

    // Добавление страницы
    const handleAddPage = async () => {
        addPageBackend();
    }


    useInfiniteScroll(handleAddPage, currentPage, pages);



    return (
        <>
            <div className="title">
                <h1>Диалоги</h1>
            </div>
            {isFetching ? (
                <Preloader />
            ) : (
                <>
                    <div className="message">
                        {dialogElements.length === 0 ? (
                                <div className="empty-content">
                                    <div className="empty-content-container">
                                        <div className="empty-content-title">
                                            <span>Диалогов нет</span>
                                        </div>
                                    </div>
                                </div>
                        ) : (
                            <div className="message-container">
                                <div className="message-items">
                                    {dialogElements}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            <Footer />
        </>
    );
}

export default DialogFragment;