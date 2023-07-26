import React, {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/logo/logo.svg';
import { userFriendlyAddress } from '../../utils';
import Avatar from '../../assets/images/avatars/no-avatar.png'


const HeaderFragment = ({
        wallet,
        connectionRestored,
        authUserId,
        authUserAvatar,
        disconnectUser,
        authUserName
    }) => {

    const profileLink = "/id" +authUserId;

    const [openMenu, setOpenMenu] = useState("");

    const menuButton = React.useRef();
    const headerUserMenuDropdown =React.useRef();

    const handleOpenMenu = () => {
        setOpenMenu(true);
    }

    const handleCloseMenu = () => {
        setTimeout(() => {
            setOpenMenu(false);
        }, 50);
    };

    const handleClickOutside = (event) => {
        if (openMenu && !menuButton.current.contains(event.target) && !headerUserMenuDropdown.current.contains(event.target)) {
            setOpenMenu(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <div className="header">
            <div className="mid">
                <div className="header-items">
                    <div className="header-item">
                        <NavLink
                            to="/feed"
                            className={({isActive}) => (isActive) ? 'header-logo' : 'header-logo'}
                        >
                            <img src={Logo} />
                        </NavLink>
                        {/* <div className="header-title">
                            <span>.beta</span>
                        </div> */}
                    </div>
                    <div className="header-item">
                        {wallet ? (
                            <div className="header-user" onClick={handleOpenMenu} ref={menuButton}>
                                <div className="header-user-data">
                                    <span>{authUserName ? authUserName : userFriendlyAddress(wallet)}</span>
                                </div>
                                <div className="header-user-avatar">
                                    <div className="header-user-avatar-image">
                                        <img src={authUserAvatar ? authUserAvatar : Avatar} />
                                    </div>
                                </div>
                                <div className={openMenu ? "header-user-menu-dropdown active" : "header-user-menu-dropdown"} ref={headerUserMenuDropdown} onClick={handleCloseMenu}>
                                        <NavLink
                                            to={profileLink} 
                                            className="header-user-menu-dropdown-button"
                                        >
                                            <span>Мой профиль</span>
                                        </NavLink>
                                        <div className="header-user-menu-dropdown-button" onClick={disconnectUser}>
                                            <span>Выйти</span>
                                        </div>
                                    </div>
                            </div>
                        ) : (
                            <>
                            {connectionRestored ? (
                                <div className="header-login">
                                    <NavLink
                                        to="/auth"
                                        className="button"
                                    >
                                        <span>Войти</span>
                                    </NavLink>
                                </div>
                                
                            ) : (
                                <div className="header=preloader">
                                    <div className="header-preloader-image">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="14" r="35" strokeDasharray="164.93361431346415 56.97787143782138"></circle>
                                        </svg>
                                    </div>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderFragment;