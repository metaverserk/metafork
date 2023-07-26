import React, {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from '../../../../assets/images/avatars/no-avatar.png';
import { userFriendlyAddress } from '../../../../utils';
import moment from 'moment';
import 'moment/locale/ru';
import ContentLoader from 'react-content-loader';

const MessageItem = ({
        id,
        userId,
        userName,
        userVerify,
        userAvatar,
        userAvatarType,
        userWallet,
        lastMessage,
        lastDate,
        unreadMessages
    }) => {
    let dialogPatch = "/im/" + userId;

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <NavLink
            to={dialogPatch}
            className="message-item"
            id={id}
        >
            <div className="message-avatar">
                <div className={userAvatarType === 'nft' ? "message-avatar-image message-avatar-nft" : "message-avatar-image"} style={{ display: !showContent && 'none' }}>
                    <img src={userAvatar ? userAvatar : Avatar} />
                </div>
                {!showContent && (
                    <div className="user-avatar-preloader">
                        <ContentLoader
                            speed={1}
                            width={60}
                            height={60}
                            viewBox="0 0 200 200"
                            backgroundColor="#232525"
                            foregroundColor="#393c3c"
                        >
                            <rect x="0" y="0" rx="5" ry="5" width="200" height="200" />
                        </ContentLoader>
                    </div>
                )}
            </div>
            <div className="message-content">
                <div className="message-header">
                    <div className="message-name">
                        <span>{userName ? userName : userFriendlyAddress(userWallet)}</span>
                    </div>
                    {userVerify ? (
                        <div className="message-verify">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.63 666.83">
                                <path d="M651.83,291.42l-45.33-52.67c-8.67-10-15.67-28.67-15.67-42v-56.67c0-35.33-29-64.33-64.33-64.33h-56.67c-13,0-32-7-42-15.67l-52.67-45.33c-23-19.67-60.67-19.67-84,0l-52.33,45.67c-10,8.33-29,15.33-42,15.33h-57.67c-35.33,0-64.33,29-64.33,64.33v57c0,13-7,31.67-15.33,41.67l-45,53c-19.33,23-19.33,60.33,0,83.33l45,53c8.33,10,15.33,28.67,15.33,41.67v57c0,35.33,29,64.33,64.33,64.33h57.67c13,0,32,7,42,15.67l52.67,45.33c23,19.67,60.67,19.67,84,0l52.67-45.33c10-8.67,28.67-15.67,42-15.67h56.67c35.33,0,64.33-29,64.33-64.33v-56.67c0-13,7-32,15.67-42l45.33-52.67c19.33-23,19.33-61-.33-84Zm-180-21l-161,161c-4.67,4.67-11,7.33-17.67,7.33s-13-2.67-17.67-7.33l-80.67-80.67c-9.67-9.67-9.67-25.67,0-35.33,9.67-9.67,25.67-9.67,35.33,0l63,63,143.33-143.33c9.67-9.67,25.67-9.67,35.33,0,9.67,9.67,9.67,25.67,0,35.33Z"/>
                            </svg>
                        </div>
                    ) : ''}
                    <div className="message-date">
                        <span>{moment(lastDate).locale('ru').format('DD MMMM YYYY')}</span>
                    </div>
                </div>
                <div className="message-body">
                    <div className="message-body-text">
                        <p>{lastMessage}</p>
                    </div>
                    <div className="message-body-data">
                        {unreadMessages ? (
                            <div className="message-body-unread"></div>
                        ) : ''}
                    </div>
                </div>
            </div>
        </NavLink>
    );
}

export default MessageItem;