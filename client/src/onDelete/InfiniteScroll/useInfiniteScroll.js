import { useEffect, useRef } from 'react';

// export const useInfiniteScroll = (handleAddPage, currentPage, pages) => {

//     const delayTimerRef = useRef(null); // Создаем переменную для хранения таймера задержки

//     useEffect(() => {
//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [currentPage, pages]);

//     const handleScroll = () => {
//         const windowHeight = window.innerHeight;
//         const documentHeight = document.documentElement.scrollHeight;
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         if (scrollTop + windowHeight >= documentHeight && currentPage < pages) {
//             clearTimeout(delayTimerRef.current); // Очищаем таймер задержки
//             delayTimerRef.current = setTimeout(() => { // Запускаем новый таймер задержки
//                 handleAddPage();
//             }, 100); // Устанавливаем задержку в 500 миллисекунд
//         }
//     };
// };



export const useInfiniteScroll = (handleAddPage, currentPage, pages) => {

    const delayTimerRef = useRef(null); // Создаем переменную для хранения таймера задержки

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, pages]);

    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (documentHeight - scrollTop < windowHeight + 400 && currentPage < pages) { // Проверяем, что пользователь находится на расстоянии 300 пикселей от конца страницы
            clearTimeout(delayTimerRef.current); // Очищаем таймер задержки
            delayTimerRef.current = setTimeout(() => { // Запускаем новый таймер задержки
                handleAddPage();
            }, 200); // Устанавливаем задержку в 100 миллисекунд
        }
    };
};