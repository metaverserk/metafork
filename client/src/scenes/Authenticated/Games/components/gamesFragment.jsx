import React from 'react';


const GamesFragment = ({
    authUserId
}) => {    

    return (
        <>
            <div className="title">
                <h1>Игры</h1>
            </div>
            <div className="games">
                <div className="games-items">
                    <div className="games-item">
                        <div className="games-container">
                            <a href="#" className="games-image">
                                <img src="https://897821.selcdn.ru/metafork/games/mzlfbkycmoo.png" />
                            </a>
                            <a href="#" className="games-title">
                                <span>Clumsy Bird</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GamesFragment;