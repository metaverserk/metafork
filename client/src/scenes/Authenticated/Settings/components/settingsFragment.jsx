import React, {useState} from 'react';
import Footer from '../../../../components/Footer';
import TextareaAutosize from 'react-textarea-autosize';
import { formatText } from '../../../../utils/index'

const SettingsFragment = ({
    updateSettingsBackend,
    updateSocialBackend,
    authUserName,
    authUserStatus,
    social
}) => {

    const [updateSettingText, setUpdateSettingText] = useState({
        name: authUserName,
        status: authUserStatus,
    });

    const [updateSocialText, setUpdateSocialText] = useState({
        telegram: social.telegram,
        instagram: social.instagram,
        twitter: social.twitter,
        discord: social.discord,
        youtube: social.youtube,
        tiktok: social.tiktok,
        vk: social.vk,
        link: social.link
    });

    const [activeTab, setActiveTab] = useState(0);

    const handleUpdateSettingText = (e, field) => {
        setUpdateSettingText({ ...updateSettingText, [field]: e.target.value });
    }

    const handleUpdateSocialText = (e, field) => {
        setUpdateSocialText({ ...updateSocialText, [field]: e.target.value });
    }

    const formatNameText = formatText(updateSettingText.name);
    const formatStatusText = formatText(updateSettingText.status);

    const handleUpdateSettings = () => {
        const updateSettingsData = {
            name: formatNameText,
            status: formatStatusText
        }
        updateSettingsBackend(updateSettingsData)
    }

    const handleUpdateSocial = () => {
        const updateSocialData = {
          telegram: updateSocialText.telegram && !updateSocialText.telegram.startsWith('http') ? `https://${updateSocialText.telegram}` : updateSocialText.telegram,
          instagram: updateSocialText.instagram && !updateSocialText.instagram.startsWith('http') ? `https://${updateSocialText.instagram}` : updateSocialText.instagram,
          twitter: updateSocialText.twitter && !updateSocialText.twitter.startsWith('http') ? `https://${updateSocialText.twitter}` : updateSocialText.twitter,
          discord: updateSocialText.discord && !updateSocialText.discord.startsWith('http') ? `https://${updateSocialText.discord}` : updateSocialText.discord,
          youtube: updateSocialText.youtube && !updateSocialText.youtube.startsWith('http') ? `https://${updateSocialText.youtube}` : updateSocialText.youtube,
          tiktok: updateSocialText.tiktok && !updateSocialText.tiktok.startsWith('http') ? `https://${updateSocialText.tiktok}` : updateSocialText.tiktok,
          vk: updateSocialText.vk && !updateSocialText.vk.startsWith('http') ? `https://${updateSocialText.vk}` : updateSocialText.vk,
          link: updateSocialText.link && !updateSocialText.link.startsWith('http') ? `https://${updateSocialText.link}` : updateSocialText.link,
        }
        updateSocialBackend(updateSocialData);
    }

    return (
        <>
            <div className="title">
                <h1>Редактирование профиля</h1>
            </div>
            <div className="menu">
                <div className="menu-container">
                    <div className="menu-items">
                        <div className={activeTab === 0 ? "menu-item active" : "menu-item"} onClick={() => setActiveTab(0)}>
                            <span>Основные</span>
                        </div>
                        <div className={activeTab === 1 ? "menu-item active" : "menu-item"} onClick={() => setActiveTab(1)}>
                            <span>Ссылки</span>
                        </div>
                    </div>
                </div>
            </div>
            {activeTab === 0 && (
            <div className="edit">
                <div className="edit-container">
                    <div className="page-edit">
                        <div className="field-group">
                            <div className="field-label">
                                <span>Имя</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSettingText(e, 'name')}
                                    value={updateSettingText.name}
                                    placeholder="Имя пользователя"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Описание блога</span>
                            </div>
                            <div className="field-input">
                                <TextareaAutosize 
                                    className="textarea" 
                                    onChange={(e) => handleUpdateSettingText(e, 'status')}
                                    value={updateSettingText.status}
                                    placeholder="Описание профиля пользователя"
                                    maxLength={150}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="page-button">
                        <button className="button" onClick={handleUpdateSettings}>
                            <span>Сохранить</span>
                        </button>
                    </div>
                </div>
            </div>
            )}
            {activeTab === 1 && (
            <div className="edit">
                <div className="edit-container">
                    <div className="page-edit">
                        <div className="field-group">
                            <div className="field-label">
                                <span>Telegram</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'telegram')}
                                    value={updateSocialText.telegram}
                                    placeholder="t.me/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Instagram</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'instagram')}
                                    value={updateSocialText.instagram}
                                    placeholder="instagram.com/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Twitter</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'twitter')}
                                    value={updateSocialText.twitter}
                                    placeholder="twitter.com/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Discord</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'discord')}
                                    value={updateSocialText.discord}
                                    placeholder="discord.gg/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Youtube</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'youtube')}
                                    value={updateSocialText.youtube}
                                    placeholder="youtube.com/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Tiktok</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'tiktok')}
                                    value={updateSocialText.tiktok}
                                    placeholder="tiktok.com/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Vk</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'vk')}
                                    value={updateSocialText.vk}
                                    placeholder="vk.com/"
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field-label">
                                <span>Ссылка</span>
                            </div>
                            <div className="field-input">
                                <input
                                    type="text"
                                    className="input"
                                    onChange={(e) => handleUpdateSocialText(e, 'link')}
                                    value={updateSocialText.link}
                                    placeholder="..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="page-button">
                        <button className="button" onClick={handleUpdateSocial}>
                            <span>Сохранить</span>
                        </button>
                    </div>
                </div>
            </div>
            )}
            <Footer />
        </>
    );
}

export default SettingsFragment;