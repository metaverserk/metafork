import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import SettingsFragment from './components/settingsFragment';

import { updateSettings, updateSocial } from '../../../api/settings'
import { setSettings, setSocial } from '../../../redux/reducers/authReducer'

import showNotification from '../../../components/Notify';

const Settings = ({
        authUserName,
        authUserStatus,
        setSettings,
        setSocial,
        social
    }) => {

    useEffect(() => {
        document.title = 'Настройки';
    }, []);

    // Обновление данных пользователя
    const updateSettingsBackend = async (updateSettingsData) => {
        try {
            const response = await updateSettings(updateSettingsData);
            setSettings(updateSettingsData)
            showNotification(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Обновление ссылок на социальные сети
    const updateSocialBackend = async (updateSocialData) => {
        try {
            const response = await updateSocial(updateSocialData);
            setSocial(updateSocialData)
            showNotification(response.data);
        } catch (error) {
            console.log(error);
        }
    } 

    return (
        <SettingsFragment
            updateSettingsBackend={updateSettingsBackend}
            updateSocialBackend={updateSocialBackend}
            authUserName={authUserName}
            authUserStatus={authUserStatus}
            social={social}
        />
    );
}

const mapStateToProps = state => ({
    authUserName: state.auth.authUserName,
    authUserStatus: state.auth.authUserStatus,
    social: state.auth.social
});

export default connect(mapStateToProps, {
    setSettings,
    setSocial
})(Settings);