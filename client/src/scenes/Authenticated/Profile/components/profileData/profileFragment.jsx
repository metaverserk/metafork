import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { declension, shortLink } from '../../../../../utils';
import ProfileAvatar from './profileAvatar';
import ProfileContent from './profileContent';
import PostContainer from '../profileFeed/postContainer';
import Preloader from '../../../../../components/Preloader';


const ProfileFragment = ({
        profile,
        social,
        userId,
        authUserId,
        addFollowBackend,
        unFollowBackend,
        uploadAvatarBackend
    }) => {

    const socialElements = social.length > 0 && Object.entries(social[0]).map(([key, value]) => (
        <Link 
            to={value}
            className="social-item"
            target="_blank"
            key={key}
        >
            <div className="social-item-container">
            <span>{shortLink(value)}</span>
            </div>
        </Link>
    ))
    
    
    return (
        <>
            {!profile || profile.id != userId ? (
                <Preloader />
            ) : (
                <>
                    <div className="profile">
                        <div className="profile-container">
                            <div className="profile-items">
                                <ProfileAvatar profile={profile} authUserId={authUserId} userId={userId} uploadAvatarBackend={uploadAvatarBackend} />
                                <ProfileContent profile={profile} social={social} authUserId={authUserId} userId={userId} addFollowBackend={addFollowBackend} unFollowBackend={unFollowBackend} />
                            </div>
                        </div>
                    </div>
                    <div className="case">
                        <div className="case-container">
                            <div className="case-items">
                            <NavLink
                                    to={`/id${userId}`}
                                    className="case-item"
                                >
                                    <div className="case-value">
                                        <span>{profile.postCount}</span>
                                    </div>
                                    <div className="case-title">
                                        <span>{declension(profile.postCount, ['Пост', 'Поста', 'Постов'])}</span>
                                    </div>
                                </NavLink>
                                <NavLink
                                    to={`/id${userId}/followers`}
                                    className="case-item"
                                >
                                    <div className="case-value">
                                        <span>{profile.followerCount}</span>
                                    </div>
                                    <div className="case-title">
                                        <span>{declension(profile.followerCount, ['Подписчик', 'Подписчика', 'Подписчиков'])}</span>
                                    </div>
                                </NavLink>
                                <NavLink
                                    to={`/id${userId}/following`}
                                    className="case-item"
                                >
                                    <div className="case-value">
                                        <span>{profile.followedCount}</span>
                                    </div>
                                    <div className="case-title">
                                        <span>{declension(profile.followedCount, ['Подписка', 'Подписки', 'Подписок'])}</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    {social.length !== 0 && (
                        <div className="social">
                            <div className="social-container">
                                <div className="social-items">
                                        {socialElements}
                                        
                                </div>
                            </div>
                        </div>
                    )}
                    <PostContainer authUserId={authUserId} userId={userId} />
                </>
            )}
        </>
    )

}


export default ProfileFragment;