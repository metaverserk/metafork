import React, {useState, useEffect} from 'react';
import ContentLoader from 'react-content-loader';



const JettonItem = ({
        image,
        balance,
        name,
        symbol,
        decimals
    }) => {

    const [showContent, setShowContent] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    });


    //const balanceInThousands = balance / 1000000000;
    const balanceInThousands = balance / (10**decimals);

    return (
        <div className="jetton-item">
            <div className="jetton-container">
                <div className="jetton-label">
                    {!showContent && (
                        <div className="jetton-label-preloader">
                            <ContentLoader
                                speed={1}
                                width={200}
                                height={200}
                                viewBox="0 0 200 200"
                                backgroundColor="#232525"
                                foregroundColor="#393c3c"
                            >
                                <rect x="0" y="0" rx="5" ry="5" width="200" height="200" />
                            </ContentLoader>
                        </div>
                    )}
                    <div className={showContent ? "jetton-label-image" : "jetton-label-image hidden"}>
                        <img src={image} />
                    </div>
                </div>
                <div className="jetton-content">
                    <div className="jetton-data">
                        <div className="jetton-header">
                            <div className="jetton-name">
                                <span>{name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="jetton-balance">
                        <span>{balanceInThousands} {symbol}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JettonItem;