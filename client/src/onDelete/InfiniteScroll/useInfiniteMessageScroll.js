import { useCallback, useEffect, useRef } from 'react';


// export const useInfiniteMessageScroll = (handleAddPage, currentPage, pages, scrollRef, wrapperRef) => {

//     const element = wrapperRef.current;
    
//     const handleScroll = useCallback(() => {
//         const scrollTop = element.scrollTop;
//         if (scrollTop <= 0 && currentPage < pages) {
//             handleAddPage();
//         }
//     }, [currentPage, handleAddPage, pages]);

   

//     useEffect(() => {
//         if(element){
//             element.addEventListener('scroll', handleScroll);
//         }

//         // Очистка слушателя событий при размонтировании компонента
//         return () => {
//             if(element){
//                 element.removeEventListener('scroll', handleScroll);
//             }
//         }
//     }, [handleScroll, element]);

// };



export const useInfiniteMessageScroll = (handleAddPage, currentPage, pages, scrollRef, wrapperRef) => {

    const element = wrapperRef.current;
    const delayTimerRef = useRef(null); // Создаем переменную для хранения таймера задержки
    
    const handleScroll = useCallback(() => {
        const scrollTop = element.scrollTop;
        if (scrollTop < 600 && currentPage < pages) {
            clearTimeout(delayTimerRef.current); // Очищаем таймер задержки
            delayTimerRef.current = setTimeout(() => { // Запускаем новый таймер задержки
                handleAddPage();
            }, 100); // Устанавливаем задержку в 500 миллисекунд
        }
    }, [currentPage, handleAddPage, pages, element]);

    useEffect(() => {
        if(element){
            element.addEventListener('scroll', handleScroll);
        }

        // Очистка слушателя событий при размонтировании компонента
        return () => {
            if(element){
                element.removeEventListener('scroll', handleScroll);
            }
            clearTimeout(delayTimerRef.current); // Очищаем таймер задержки при размонтировании компонента
        }
    }, [handleScroll, element]);

};


