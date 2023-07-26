import moment from 'moment';
import React from 'react';
import { NavLink } from 'react-router-dom';
import 'moment/locale/ru';
moment.locale('ru'); 


const NotificationItem = ({
        id,
        type,
        urlId,
        unread,
        lastDate
    }) => {
    
    const postUrl = '/post/' +urlId;
    const commentUrl = '/post/' +urlId;

    return (
        <NavLink
            to={type === 'post' ? postUrl : commentUrl}
            className={unread === 1 ? 'notification-item notification-unread' : 'notification-item'}
        >
            <div className="notification-body">
                {/* {unread === 1 ? (
                    <div className="notification-body-unread"></div>
                ) : ''} */}
                {type === 'post' ? (
                    <div className="notification-body-text">
                        <span>На ваш пост появился новый комментарий</span>
                    </div>
                ) : (
                    <div className="notification-body-text">
                        <span>На ваш комментарий появился новый ответ</span>
                    </div>
                )}
                <div className="notification-body-date">
                    <span>{moment(lastDate).format('DD MMMM YYYY')}</span>
                </div>
            </div>
        </NavLink>
    );
};

export default NotificationItem;