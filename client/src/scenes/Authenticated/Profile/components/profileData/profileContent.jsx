import React, {useEffect} from 'react';
import { userFriendlyAddress, userFriendlyAddressFull } from '../../../../../utils';
import { Link, NavLink } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import showNotification from '../../../../../components/Notify';
import Autolinker from 'autolinker';
import { shortLink } from '../../../../../utils';

const ProfileContent = ({
        profile,
        userId,
        authUserId,
        addFollowBackend,
        unFollowBackend
    }) => {

    useEffect(() => {
        document.title = profile.name || userFriendlyAddress(profile.wallet);
    }, [profile]);

    // Уведомление о скопированном кошельке
    const notifyToClipboard = () => {
        showNotification('Кошелёк скопирован');
    }

    // Сокращение ссылок и вывод хэштегов
    const linkedText = Autolinker.link(profile.status, {
        truncate: { length: 20, location: 'end' },
    });

    // Ссылка на диалог с пользователем
    let dialogUrl = "/im/" + userId;

   

    return (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-name">
                    <span>{!profile.name ? userFriendlyAddress(profile.wallet) : profile.name}</span>
                </div>
                <div className="profile-wallet">
                    <CopyToClipboard text={userFriendlyAddressFull(profile.wallet)}>
                        <div className="profile-wallet-button" onClick={notifyToClipboard}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 102.91 98.92"
                            >
                                <path d="M58.78,98.92H18.15c-10.01,0-18.15-8.14-18.15-18.15V40.15c0-10.01,8.14-18.15,18.15-18.15H58.78c10.01,0,18.15,8.14,18.15,18.15v40.63c0,10.01-8.14,18.15-18.15,18.15ZM18.15,29c-6.15,0-11.15,5-11.15,11.15v40.63c0,6.15,5,11.15,11.15,11.15H58.78c6.15,0,11.15-5,11.15-11.15V40.15c0-6.15-5-11.15-11.15-11.15H18.15Z"/>
                                <path d="M84.76,0H44.13c-9.28,0-16.94,7-18.01,16h7.07c1.01-5.12,5.52-9,10.93-9h40.63c6.15,0,11.15,5,11.15,11.15V58.78c0,6.15-5,11.15-11.15,11.15h-1.83v7h1.83c10.01,0,18.15-8.14,18.15-18.15V18.15c0-10.01-8.14-18.15-18.15-18.15Z"/>
                            </svg>
                        </div>
                    </CopyToClipboard>
                </div>
                {profile.verify && (
                    <div className="profile-verify">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 666.63 666.83"
                        >
                            <path d="M651.83,291.42l-45.33-52.67c-8.67-10-15.67-28.67-15.67-42v-56.67c0-35.33-29-64.33-64.33-64.33h-56.67c-13,0-32-7-42-15.67l-52.67-45.33c-23-19.67-60.67-19.67-84,0l-52.33,45.67c-10,8.33-29,15.33-42,15.33h-57.67c-35.33,0-64.33,29-64.33,64.33v57c0,13-7,31.67-15.33,41.67l-45,53c-19.33,23-19.33,60.33,0,83.33l45,53c8.33,10,15.33,28.67,15.33,41.67v57c0,35.33,29,64.33,64.33,64.33h57.67c13,0,32,7,42,15.67l52.67,45.33c23,19.67,60.67,19.67,84,0l52.67-45.33c10-8.67,28.67-15.67,42-15.67h56.67c35.33,0,64.33-29,64.33-64.33v-56.67c0-13,7-32,15.67-42l45.33-52.67c19.33-23,19.33-61-.33-84Zm-180-21l-161,161c-4.67,4.67-11,7.33-17.67,7.33s-13-2.67-17.67-7.33l-80.67-80.67c-9.67-9.67-9.67-25.67,0-35.33,9.67-9.67,25.67-9.67,35.33,0l63,63,143.33-143.33c9.67-9.67,25.67-9.67,35.33,0,9.67,9.67,9.67,25.67,0,35.33Z"/>
                        </svg>
                    </div>
                )}
            </div>
            {profile.status && (
                <div className="profile-info">
                    <p dangerouslySetInnerHTML={{ __html: linkedText }}></p>
                </div>
            )}
            <div className="profile-action">
                {authUserId ? (
                    <>
                        {authUserId == userId ? (
                            <div className="profile-button">
                                <NavLink
                                    to="/settings"
                                    className="button button-gray"
                                >
                                    <span>Редактировать</span>
                                </NavLink>
                            </div>
                        ) : (
                            <>
                            {profile.followed ? (
                                <div className="profile-button">
                                    <button className="button button-gray" onClick={unFollowBackend}>
                                        <span>Отписаться</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="profile-button">
                                    <button className="button" onClick={addFollowBackend}>
                                        <span>Подписаться</span>
                                    </button>
                                </div>
                            )}
                            <div className="profile-button">
                                <NavLink
                                    to={dialogUrl}
                                    className="button button-gray"
                                >
                                    <span>Написать</span>
                                </NavLink>
                            </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="profile-button">
                        <NavLink
                            to="/auth"
                            className="button"
                        >
                            <span>Подписаться</span>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileContent;