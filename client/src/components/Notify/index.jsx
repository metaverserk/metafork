import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const notificationContainers = new Map(); // переменная для хранения контейнеров с уведомлениями

const Notification = ({ message, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true); // показываем уведомление
        const timer = setTimeout(() => {
            setShow(false); // скрываем уведомление
            const closeTimer = setTimeout(onClose, 500); // вызываем onClose через 500 мс
            return () => clearTimeout(closeTimer);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

  return (
    <div className={`notice-item ${show ? 'notice-show' : 'notice-hidden'}`}>
        <div className="notice-container">
            <div className="notice-text">
            <span>{message}</span>
            </div>
        </div>
    </div>
  );
};

const showNotification = (message) => {
    let notificationContainer = notificationContainers.get(message); // проверяем, существует ли уже контейнер для данного сообщения

    if (!notificationContainer) {
        // если контейнер еще не создан, создаем его и добавляем в карту
        notificationContainer = document.createElement('div');
        notificationContainer.setAttribute('class', 'notice');
        document.body.appendChild(notificationContainer);
        notificationContainers.set(message, notificationContainer);
    }

    let root = notificationContainer._reactRootContainer; // получаем root для данного контейнера

    if (!root) {
        // если root еще не создан, создаем его и сохраняем в контейнере
        root = createRoot(notificationContainer);
        notificationContainer._reactRootContainer = root;
    }

    root.render(<Notification message={message} onClose={() => removeNotification(message)} />);
};

const removeNotification = (message) => {
    const notificationContainer = notificationContainers.get(message);
    const root = notificationContainer._reactRootContainer;
    root.unmount(); // удаляем компонент с помощью метода unmount()
    notificationContainers.delete(message); // удаляем контейнер из карты
    document.body.removeChild(notificationContainer); // удаляем контейнер из DOM
};

export default showNotification;