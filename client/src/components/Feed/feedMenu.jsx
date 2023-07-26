import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';


const FeedMenu = ({
        authUserId
    }) => {


    const { search } = useLocation();
    const { type } = queryString.parse(search);
    const { query } = queryString.parse(search);

    return (
        <div className="menu">
                <div className="menu-container">
                    <div className="menu-items">
                            {authUserId ? (
                                <NavLink
                                    to="/feed"
                                    className={({isActive}) => (isActive && !type && !query) ? 'menu-item active' : 'menu-item'}
                                    end
                                >
                                    <span>Подписки</span>
                                </NavLink>
                            ) : ''}
                            <NavLink
                                to="/feed?type=new"
                                className={({isActive}) => (isActive && type === 'new') ? 'menu-item active' : 'menu-item'}
                                end
                            >
                                <span>Свежее</span>
                            </NavLink>
                            {/* {authUserId ? (
                                <NavLink
                                    to="/feed?type=popular"
                                    className={({isActive}) => (isActive && type === 'popular') ? 'menu-item active' : 'menu-item'}
                                    end
                                >
                                    <span>Популярное</span>
                                </NavLink>
                            ) : ''} */}
                    </div>
                </div>
            </div>
    );
}

export default FeedMenu;