import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NotificationsFragment from './components/NotificationsFragment';
import { getNotify, readNotify, getNotifyCount, getNotifyPage } from '../../../api/notifications'
import { setNotifications, setToogleFetching, addNotificationList } from '../../../redux/reducers/notificationReducer'
import { setUnreadNotify } from '../../../redux/reducers/authReducer'


const Notifications = ({
        authUserId,
        setNotifications,
        notificationData,
        setUnreadNotify,
        setToogleFetching,
        isFetching,
        currentPage,
        pages,
        addNotificationList

    }) => {

    useEffect(() => {
        document.title = 'Центр уведомлений';
        fetchData();
        const timer = setTimeout(() => {
            fetchRead();
            fetchCount();
        }, 500);
        return () => {
            clearTimeout(timer);
            setNotifications([]);
            setToogleFetching(true);
        };
    }, [authUserId]);


    const fetchData = async () => {
        try {
            const response = await getNotify();
            const { items, totalCount, limit, pages } = response.data;
            setNotifications(items, totalCount, limit, pages)
        } catch (error) {
            console.log(error);
        } finally {
            setToogleFetching(false);
        }
    };

    const fetchRead = async () => {
        try {
            const response = await readNotify();
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCount = async () => {
        try {
            const response = await getNotifyCount();
            setUnreadNotify(response.data.unread);
        } catch (error) {
            console.log(error)
        }
    }

    // Добавление страницы 
    const addPageBackend = async () => {
        try {
            const response = await getNotifyPage(currentPage);
            addNotificationList(response.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <NotificationsFragment
            notificationData={notificationData}
            isFetching={isFetching}
            addPageBackend={addPageBackend}
            currentPage={currentPage}
            pages={pages}
        />
    );
};

const mapStateToProps = state => ({
    authUserId: state.auth.authUserId,
    notificationData: state.notification.notificationData,
    isFetching: state.notification.isFetching,
    currentPage: state.notification.currentPage,
    pages: state.notification.pages
});

export default connect(mapStateToProps, {
    setNotifications,
    setUnreadNotify,
    setToogleFetching,
    addNotificationList
})(Notifications);