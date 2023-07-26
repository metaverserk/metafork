import React, {useState, useEffect} from 'react';
import NoAvatar from '../../assets/images/avatars/no-avatar.png';
import { NavLink } from 'react-router-dom';
import { userFriendlyAddress, declension } from '../../utils';
import ContentLoader from "react-content-loader"

const UserItem = ({
        userId,
        avatar,
        name,
        wallet,
        followerCount,
        authUserId,
        followed,
        verify,
        addFollowBackend,
        unFollowBackend,
        avatarType
    }) => {

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    let followUser = () => {
        addFollowBackend(userId)
    }

    let unFollowUser = () => {
        unFollowBackend(userId)
    }

    let userPatch = "/id" + userId;

    
    return (
        <div className="user-item" id={userId}>
            <div className="user-container">
                <NavLink
                    to={userPatch}
                    className="user-avatar"
                >
                    <div className={avatarType === 'nft' ? "user-avatar-image user-avatar-nft" : "user-avatar-image"} style={{ display: !showContent && 'none' }}>
                        <img src={avatar ? avatar : NoAvatar} />
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
                </NavLink>


                <div className="user-content">
                    <div className="user-data">
                        <div className="user-header">
                            <NavLink
                                to={userPatch}
                                className="user-name"
                            >
                                <span>{!name ? userFriendlyAddress(wallet) : name}</span>
                            </NavLink>
                            {verify ? (
                                <div className="user-verify">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.63 666.83">
                                        <path d="M651.83,291.42l-45.33-52.67c-8.67-10-15.67-28.67-15.67-42v-56.67c0-35.33-29-64.33-64.33-64.33h-56.67c-13,0-32-7-42-15.67l-52.67-45.33c-23-19.67-60.67-19.67-84,0l-52.33,45.67c-10,8.33-29,15.33-42,15.33h-57.67c-35.33,0-64.33,29-64.33,64.33v57c0,13-7,31.67-15.33,41.67l-45,53c-19.33,23-19.33,60.33,0,83.33l45,53c8.33,10,15.33,28.67,15.33,41.67v57c0,35.33,29,64.33,64.33,64.33h57.67c13,0,32,7,42,15.67l52.67,45.33c23,19.67,60.67,19.67,84,0l52.67-45.33c10-8.67,28.67-15.67,42-15.67h56.67c35.33,0,64.33-29,64.33-64.33v-56.67c0-13,7-32,15.67-42l45.33-52.67c19.33-23,19.33-61-.33-84Zm-180-21l-161,161c-4.67,4.67-11,7.33-17.67,7.33s-13-2.67-17.67-7.33l-80.67-80.67c-9.67-9.67-9.67-25.67,0-35.33,9.67-9.67,25.67-9.67,35.33,0l63,63,143.33-143.33c9.67-9.67,25.67-9.67,35.33,0,9.67,9.67,9.67,25.67,0,35.33Z"/>
                                    </svg>
                                </div>
                            ) : ''}
                        </div>
                        <div className="user-subscribers">
                            <span>{followerCount} {declension(followerCount, ['Подписчик', 'Подписчика', 'Подписчиков'])}</span>
                        </div>
                    </div>
                    <div className="user-action">
                        {authUserId != userId ? (
                            <>
                            {authUserId ? (
                                <>
                                    {followed ? (
                                        <button className="button-small button-gray" onClick={unFollowUser}>
                                            <div className="button-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                                    <path d="M682.97,597.22l-197.22-197.22,197.22-197.22c23.67-23.67,23.68-62.06,0-85.74h0c-23.67-23.67-62.06-23.68-85.74,0l-197.22,197.22L202.79,117.04c-23.67-23.67-62.06-23.68-85.74,0h0c-23.67,23.67-23.68,62.06,0,85.74l197.22,197.22-197.22,197.22c-23.67,23.67-23.68,62.06,0,85.74h0c23.67,23.67,62.06,23.68,85.74,0l197.22-197.22,197.22,197.22c23.67,23.67,62.06,23.68,85.74,0h0c23.67-23.67,23.68-62.06,0-85.74h0Z"/>
                                                </svg> 
                                            </div>
                                        </button> 
                                    ) : (
                                        <button className="button-small button-default" onClick={followUser}>
                                            <div className="button-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800.33 800.33">
                                                    <path d="M739.71,339.54H460.8V60.63c0-33.48-27.14-60.63-60.63-60.63h0c-33.48,0-60.63,27.14-60.63,60.63V339.54H60.63c-33.48,0-60.63,27.14-60.63,60.63H0c0,33.48,27.14,60.63,60.63,60.63H339.54v278.91c0,33.48,27.14,60.63,60.63,60.63h0c33.48,0,60.63-27.14,60.63-60.63V460.8h278.91c33.48,0,60.63-27.14,60.63-60.63h0c0-33.48-27.14-60.63-60.63-60.63Z"/>
                                                </svg>
                                            </div>
                                        </button>
                                    )}
                                </>
                            ) : ''}
                            </>
                        ) : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserItem;