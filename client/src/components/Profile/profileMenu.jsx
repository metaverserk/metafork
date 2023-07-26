import React from 'react';
import { NavLink } from 'react-router-dom';


const ProfileMenu = ({
    userId
    }) => {

    let nftPatch = "/id" + userId + '/nft';
    let profilePatch = "/id" + userId;
    let jettonsPatch = "/id" + userId + '/jettons';

    return (
        <div className="menu">
            <div className="menu-container">
                <div className="menu-items">
                    <NavLink
                        end to={profilePatch}
                        className="menu-item"
                    >
                        <span>Записи</span>
                    </NavLink>
                    <NavLink
                        end to={nftPatch}
                        className="menu-item"
                    >
                        <span>Коллекция</span>
                    </NavLink>
                    <NavLink
                        end to={jettonsPatch}
                        className="menu-item"
                    >
                        <span>Жетоны</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default ProfileMenu;