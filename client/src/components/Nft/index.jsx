import React, {useState, useEffect} from 'react';
import { userFriendlyAddressFull } from '../../utils'
import { NavLink } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ContentLoader from 'react-content-loader';




const NftItem = ({
        image,
        address,
        name,
        userId,
        authUserId,
        changeNftAvatar
    }) => {

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 1900);
        return () => clearTimeout(timer);
    }, []);

    const getLink = 'https://getgems.io/nft/' +userFriendlyAddressFull(address);

    const handleChangeAvatar = () => {
        changeNftAvatar(image)
    }

    return (
            <div className="nft-item">
                <div className="nft-container">
                    <NavLink
                        to={getLink}
                        className="nft-image"
                        target="_blank"
                    >
                        <img src={image} style={{ display: !showContent && 'none' }} />
                        {!showContent && (
                            <div className="user-avatar-preloader">
                                <ContentLoader
                                    speed={1}
                                    width={600}
                                    height={600}
                                    viewBox="0 0 600 600"
                                    backgroundColor="#232525"
                                    foregroundColor="#393c3c"
                                >
                                    <rect x="0" y="0" rx="5" ry="5" width="600" height="600" />
                                </ContentLoader>
                            </div>
                        )}
                    </NavLink>
                    <NavLink
                        to={getLink}
                        className="nft-title"
                        target="_blank"
                    >
                        <span>{name ? name : '...'}</span>
                    </NavLink>
                    {authUserId == userId ? (
                    <div className="nft-action">
                        <button className="button button-gray" onClick={handleChangeAvatar}>
                            <span>На аватарку</span>
                        </button>
                    </div>
                    ) : ''}
                </div>
            </div>
       
    );
}

export default NftItem;