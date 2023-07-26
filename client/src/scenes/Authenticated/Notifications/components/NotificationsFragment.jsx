import React from 'react';
import NotificationItem from '../../../../components/Notification'
import Footer from '../../../../components/Footer'
import Preloader from '../../../../components/Preloader';
import { useInfiniteScroll } from '../../../../utils';


const NotificationsFragment = ({
        notificationData,
        isFetching,
        addPageBackend,
        currentPage,
        pages
    }) => {

    let NotificationElements = notificationData.map(notify => 
        <NotificationItem
            key={notify.id}
            id={notify.id}
            type={notify.type}
            urlId={notify.urlId}
            unread={notify.unread}
            lastDate={notify.date}
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
            <h1>Центр уведомлений</h1>
        </div>
        {isFetching ? (
            <Preloader />
        ) : (
            <>
                <div className="notification">
                    {NotificationElements[0] ? (
                        <div className="notification-container">
                            <div className="notification-items">
                                {NotificationElements}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-content">
                            <div className="empty-content-container">
                                <div className="empty-content-title">
                                    <span>У Вас нет уведомлений</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {currentPage < pages ? (
                    <Preloader />
                ) : ''}
            </>
        )}
        <Footer />
        </>
    );
};

export default NotificationsFragment;