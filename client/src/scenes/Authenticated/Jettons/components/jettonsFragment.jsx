import React from 'react';
import ProfileMenu from '../../../../components/Profile/profileMenu';
import Footer from '../../../../components/Footer';
import Preloader from '../../../../components/Preloader';
import JettonItem from '../../../../components/Jetton';


const JettonsFragment = ({
       userId,
       isFetching,
       profile,
       jettons
    }) => {
       
    const filteredJettons = jettons.filter(jetton => jetton.balance > 0);

    const jettonsElements = filteredJettons.map(jetton => 
        <JettonItem
            key={jetton.jetton.address}
            image={jetton.jetton.image}
            balance={jetton.balance}
            name={jetton.jetton.name}
            symbol={jetton.jetton.symbol}
            decimals={jetton.jetton.decimals}
        />
    );
    

    return (
        <>
            {!profile || profile.id != userId ? (
                <Preloader />
            ) : (
            <>
                <div className="title">
                    <h1>Жетоны пользователя</h1>
                </div>
                <ProfileMenu userId={userId} />
                {isFetching ? (
                    <Preloader />
                ) : (
                    <>
                    {jettons.length === 0 ? (
                        <div className="empty-content">
                            <div className="empty-content-container">
                                <div className="empty-content-title">
                                    <span>У пользователя нет жетонов</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="jetton">
                                <div className="jetton-items">
                                    {jettonsElements}
                                </div>
                            </div>
                        </>
                    )}
                    </>
                )}
            </>
            )}
            <Footer />
        </>
    );
};

export default JettonsFragment;