import React from 'react';
import Footer from '../../../components/Footer';
import { NavLink } from 'react-router-dom';

const Error = () => {

    return (
        <>
            <div className="error">
                <div className="error-container">
                    <div className="error-title">
                        <span>Страница отсутствует</span>
                    </div>
                    <div className="error-button">
                        <NavLink
                            to="/"
                            className="button"
                        >
                            <span>На главную</span>
                        </NavLink>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Error;