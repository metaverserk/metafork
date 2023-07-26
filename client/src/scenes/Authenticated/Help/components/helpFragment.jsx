import React, {useState} from 'react';
import Footer from '../../../../components/Footer';

const HelpFragment = () => {


    const [activeIndex, setActiveIndex] = useState(null);

    function handleClick(index) {
        setActiveIndex(index === activeIndex ? null : index);
    }

    return (
        <>
            <div className="title">
                <h1>Помощь</h1>
            </div>
            <div className="help">
                <div className="help-container">
                    <div className="help-item">
                        <div className={`help-title ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleClick(0)}>
                            <span>Для чего нужно подключать кошелек?</span>
                        </div>
                        <div className="help-content">
                            <p>Наш сервис использует открытый стандарт для безопасного входа в интернет-сервисы без логинов и паролей Ton Connect 2.0.</p><p>TON Connect 2.0 позволяет проводить процедуру авторизации на онлайн-площадках в один клик, пользуясь всеми преимуществами Web 3.0. На текущий момент, наш сервис поддерживает авторизацию при помощи кошельков Tonkeeper и Tonhub.</p><p>Подтверждая авторизацию в кошельке, Вы тем самым создаете аккаунт профиля на нашей площадке, либо входите в уже существующий, если он был ранее создан.</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <div className={`help-title ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleClick(1)}>
                            <span>Как установить NFT аватар</span>
                        </div>
                        <div className="help-content">
                            <p>Для того, чтобы установить NFT аватар в качестве аватара профиля, Вам достаточно кликнуть на кнопку «На аватарку» возле желаемого NFT токена в разделе «Коллекция»</p><p>Если у вас еще нет NFT, Вы можете приобрести один из них на маркетплейсе NFT токенов Getgems.io</p>
                        </div>
                    </div>
                    <div className="help-item">
                        <div className={`help-title ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleClick(2)}>
                            <span>Ограничения на загрузку медиафайлов</span>
                        </div>
                        <div className="help-content">
                            <p>На платформе действуют временные ограничения, связанные с загрузкой медиафайлов:</p>
                            <p>– Загрузка видеофайлов не более 40 мб. и длительностью не более 2 минут<br />– Загрузка изображений размером не более 30 мб.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default HelpFragment;