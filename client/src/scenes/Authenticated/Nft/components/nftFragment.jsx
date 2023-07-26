import React from 'react';
import NftItem from '../../../../components/Nft';
import ProfileMenu from '../../../../components/Profile/profileMenu';
import Preloader from '../../../../components/Preloader'
import Footer from '../../../../components/Footer';


const NftFragment = ({
        nft,
        userId,
        isFetching,
        profile,
        addPageBackend,
        nftCount,
        authUserId,
        changeNftAvatar
    }) => {
       
    const nftElements = nft.map(nft => 
        <NftItem
            key={nft.address}
            address={nft.address}
            image={nft.previews[2].url}
            name={nft.metadata.name}
            userId={userId}
            authUserId={authUserId}
            changeNftAvatar={changeNftAvatar}
        />
    );

    const handleAddPage = async () => {
        addPageBackend();
    }
    

    return (
        <>
            {!profile || profile.id != userId ? (
                <Preloader />
            ) : (
                <>
                <div className="title">
                    <h1>NFT коллекция</h1>
                </div>
                <ProfileMenu userId={userId} />
                {isFetching ? (
                    <Preloader />
                ) : (
                    <>
                    {nft.length === 0 ? (
                        <div className="empty-content">
                            <div className="empty-content-container">
                                <div className="empty-content-title">
                                    <span>У пользователя нет NFT</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                        <div className="nft">
                            <div className="nft-items">
                                {nftElements}
                            </div>
                        </div>
                        {nft.length < nftCount ? (
                        <div className="pagination" onClick={handleAddPage}>
                            <div className="pagination-container">
                                <div className="pagination-title">
                                    <span>Показать еще</span>
                                </div>
                            </div>
                        </div>
                        ) : ''}
                        </>
                    )}
                    </>
                )}
                <Footer />
                </>
            )}
        </>
    );
};

export default NftFragment;