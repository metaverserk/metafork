import React from 'react';

const Tab = (props) => {

    return (
        <div className="auth-tab-item active">
            <div className="auth-tab-icon">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDkuOTM3NDlMMSA1LjgxMjQ5TDEyIDEuNjg3NDlMMjMgNS44MTI0OUwxMiA5LjkzNzQ5WiIgZmlsbD0iIzQ1QUVGNSIvPgo8cGF0aCBvcGFjaXR5PSIwLjYiIGQ9Ik0xMiA5LjkzNzQ4TDIzIDUuODEyNDhMMTIgMjIuMzEyNVY5LjkzNzQ4WiIgZmlsbD0iIzQ1QUVGNSIvPgo8cGF0aCBvcGFjaXR5PSIwLjgiIGQ9Ik0xMiA5LjkzNzQ4TDEgNS44MTI0OEwxMiAyMi4zMTI1VjkuOTM3NDhaIiBmaWxsPSIjNDVBRUY1Ii8+Cjwvc3ZnPgo=" />
            </div>
            <div className="auth-tab-title">
                <span>Tonkeeper</span>
            </div>
        </div>
    )

}

export default Tab;