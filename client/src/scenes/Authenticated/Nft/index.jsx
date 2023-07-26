import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import NftFragment from './components/nftFragment';
import { getNft, getUserProfile, getNftCount, changeAvatarUrl } from '../../../api/profile';
import { addNftList, setNft, setUserProfile, setToggleFetching, changeAvatar } from '../../../redux/reducers/profileReducer';
import { changeAuthAvatar } from '../../../redux/reducers/authReducer';
import showNotification from '../../../components/Notify';


const Nft = ({
        wallet,
        nft,
        setNft,
        setUserProfile,
        isFetching,
        setToggleFetching,
        profile,
        addNftList,
        authUserId,
        changeAvatar,
        changeAuthAvatar
    }) => {

    const { userLink } = useParams();
    const userId = userLink.replace("id", "");

    const [limit, setLimit] = useState("30");
    const [nftCount, setNftCount] = useState(null);

    useEffect(() => {

        document.title = 'NFT пользователя';

        fetchProfile();
        fetchData();

        return () => {
            setNft([]);
            setToggleFetching(true);
        };
    }, [userId, wallet]);

    const fetchProfile = async () => {
        try {
            const requestData = { userId };
            const responseProfile = await getUserProfile(requestData);
            setUserProfile(responseProfile.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = async () => {
        try {
            if (wallet) {
                // Получение данных о количестве NFT
                const responseNftCount = await getNftCount(wallet);
                setNftCount(responseNftCount.response.data.nft_items.length)
                // Получение NFT токенов
                const responseNft = await getNft(wallet, limit);
                setNft(responseNft.response.data.nft_items);
                setLimit(responseNft.newLimit);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setToggleFetching(false);
        }
    };

    const addPageBackend = async () => {
        try {
            const response = await getNft(wallet, limit);
            addNftList(response.response.data.nft_items);
            setLimit(response.newLimit);
            // console.log(response.response)
        } catch (error) {
            console.log(error);
        }
    };

    // Выбор NFT аватара
    const changeNftAvatar = async (url) => {
        try {
            const avatarType = 'nft';
            const requestData = { avatarUrl: url, avatarType };
            const responseChangeAvatar = await changeAvatarUrl(requestData);
            changeAvatar(responseChangeAvatar.data.avatarUrl);
            changeAuthAvatar(responseChangeAvatar.data.avatarUrl);
            showNotification('NFT аватар установлен');
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <NftFragment 
            nft={nft}
            isFetching={isFetching}
            profile={profile}
            addPageBackend={addPageBackend}
            nftCount={nftCount}
            userId={userId}
            authUserId={authUserId}
            changeNftAvatar={changeNftAvatar}
        />
    );
};

const mapStateToProps = state => ({
    wallet: state.profile.profile.wallet,
    nft: state.profile.nft,
    isFetching: state.profile.isFetching,
    profile: state.profile.profile,
    authUserId: state.auth.authUserId
});

export default connect(mapStateToProps, {
    setNft,
    setUserProfile,
    setToggleFetching,
    addNftList,
    changeAvatar,
    changeAuthAvatar
})(Nft);