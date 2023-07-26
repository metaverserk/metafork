import React, {useState, useEffect} from 'react';
import Avatar from '../../../../../assets/images/avatars/no-avatar.png';
import ContentLoader from 'react-content-loader';

const ProfileAvatar = ({
        profile,
        uploadAvatarBackend,
        authUserId,
        userId
    }) => {
    
    const uploadAvatarElement = React.useRef();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    });

    // Смена аватарки
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        uploadAvatarBackend(file);
    }

    // Клик по файловому полю
    const handleFileClick = () => {
        uploadAvatarElement.current.click();
    }

    return (
        <div className="profile-avatar">
            {authUserId == userId && (
            <div className="profile-avatar-download" onClick={handleFileClick} style={{ display: !showContent && 'none' }}>
                <input type="file" name="file" onChange={handleFileChange} ref={uploadAvatarElement} accept=".jpg, .jpeg, .png" />
                <div className="profile-avatar-download-button">
                    <div className="profile-avatar-download-image">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 800 800"
                        >
                            <path d="M666.67,166.67h-112.67l-15-29.67c-11.26-22.66-34.37-36.99-59.67-37h-158.67c-25.3,.01-48.41,14.34-59.67,37l-15,29.67h-112.67c-36.82,0-66.67,29.85-66.67,66.67v400c0,36.82,29.85,66.67,66.67,66.67H666.67c36.82,0,66.67-29.85,66.67-66.67V233.33c0-36.82-29.85-66.67-66.67-66.67Zm-266.67,400c-73.64,0-133.33-59.7-133.33-133.33s59.7-133.33,133.33-133.33,133.33,59.7,133.33,133.33-59.7,133.33-133.33,133.33Z" />
                        </svg>
                    </div>
                </div>
            </div>
            )}
            <div className={profile.avatarType === 'nft' ? "profile-avatar-image profile-avatar-nft" : "profile-avatar-image"} style={{ display: !showContent && 'none' }}>
                <img src={profile.avatar ? profile.avatar : Avatar} alt={profile.name} />
            </div>
            {!showContent && (
                <div className="user-avatar-preloader">
                    <ContentLoader
                        speed={1}
                        width={120}
                        height={120}
                        viewBox="0 0 200 200"
                        backgroundColor="#232525"
                        foregroundColor="#393c3c"
                    >
                        <rect x="0" y="0" rx="5" ry="5" width="200" height="200" />
                    </ContentLoader>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar;