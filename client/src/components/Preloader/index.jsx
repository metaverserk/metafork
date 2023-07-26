import React from 'react';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="preloader-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.22 40.22">
                    <path d="M20.13,40.22s-.03,0-.04,0C9.03,40.21,.02,31.21,0,20.15c0-1.75,1.42-3.18,3.17-3.18h0c1.75,0,3.17,1.42,3.18,3.17,.01,7.57,6.19,13.73,13.76,13.73h.08c1.72,.03,3.11,1.44,3.11,3.18,0,1.75-1.42,3.17-3.17,3.17Zm16.91-16.95c-1.75,0-3.17-1.42-3.18-3.17,0-7.58-6.18-13.75-13.76-13.75h-.04c-1.75,0-3.18-1.42-3.18-3.18S18.31,0,20.07,0V0s.04,0,.04,0h0c11.08,0,20.1,9.02,20.11,20.1,0,1.75-1.42,3.18-3.17,3.18h0Z"/>
                </svg>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="14" r="35" strokeDasharray="164.93361431346415 56.97787143782138"></circle>
                </svg> */}
            </div>
        </div>
    );
}

export default Preloader;