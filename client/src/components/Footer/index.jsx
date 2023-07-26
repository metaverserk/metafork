import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-items">
                    <div className="footer-nav">
                        <NavLink
                            to="/help"
                            className="footer-nav-item"
                        >
                            <span>Помощь</span>
                        </NavLink>
                        {/* <NavLink
                            to="/"
                            className="footer-nav-item"
                        >
                            <span>Контакты</span>
                        </NavLink> */}
                    </div>
                    {/* <div className="footer-copyright">
                        <NavLink
                            to="/id/1"
                            className="footer-nav-item"
                        >
                            <span>Андрей Мельников</span>
                        </NavLink>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Footer;