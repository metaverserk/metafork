import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import JettonsFragment from './components/jettonsFragment';
import { getJettons, getUserProfile } from '../../../api/profile';
import { setJettons, setToggleFetching, setUserProfile } from '../../../redux/reducers/profileReducer';


const Jettons = ({
    wallet,
    setJettons,
    jettons,
    setToggleFetching,
    setUserProfile,
    profile,
    isFetching,
    authUserId
}) => {

    const { userLink } = useParams();
    const userId = userLink.replace("id", "");

    useEffect(() => {

        document.title = 'Жетоны пользователя';
        
        fetchProfile();
        fetchData();

        return () => {
            setJettons([]);
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
                // Получение жетонов
                const responseJettons = await getJettons(wallet);
                setJettons(responseJettons.response.data.balances)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setToggleFetching(false);
        }
    };

    return (
        <JettonsFragment 
           userId={userId}
           isFetching={isFetching}
           profile={profile}
           jettons={jettons}
        />
    );
};

const mapStateToProps = state => ({
    wallet: state.profile.profile.wallet,
    jettons: state.profile.jettons,
    isFetching: state.profile.isFetching,
    profile: state.profile.profile,
    authUserId: state.auth.authUserId
});

export default connect(mapStateToProps, {
   setJettons,
   setToggleFetching,
   setUserProfile
})(Jettons);