import React from 'react';

const EmptyPosts = () => {
    return (
        <div className="no-content">
            <div className="no-content-container">
                <div className="no-content-cover">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 605">
                        <path d="M0,225c0-8.97,4.81-17.26,12.6-21.71L362.6,3.29c7.69-4.39,17.12-4.39,24.8,0l350,200c11.99,6.85,16.15,22.12,9.3,34.11-2.21,3.88-5.43,7.09-9.3,9.3l-350,200c-7.69,4.39-17.12,4.39-24.8,0L12.6,246.71C4.81,242.25,0,233.97,0,225Zm712.6,133.29l-337.6,192.91L37.4,358.29c-11.99-6.84-27.26-2.67-34.11,9.32-6.84,11.98-2.68,27.24,9.3,34.09l350,200c7.69,4.39,17.12,4.39,24.8,0l350-200c11.99-6.86,16.14-22.13,9.29-34.11-6.85-11.98-22.11-16.14-34.09-9.3Z"/>
                    </svg>
                </div>
                <div className="no-content-title">
                    <span>Записи отсутствуют</span>
                </div>
            </div>
        </div>
    );
}

export default EmptyPosts;