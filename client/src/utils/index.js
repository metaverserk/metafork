import React, {useEffect, useRef, useCallback, useState} from 'react'
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import ReactDOMServer from 'react-dom/server';


// Получение сокращенного адреса кошелька
export const userFriendlyAddress = (wallet) => {
    const userFriendlyAddress = wallet ? toUserFriendlyAddress(wallet) : '';
    return userFriendlyAddress.slice(0, 4) + '…' + userFriendlyAddress.slice(-4);
}

// Получение полного адреса кошелька
export const userFriendlyAddressFull = (wallet) => {
    const userFriendlyAddress = wallet ? toUserFriendlyAddress(wallet) : '';
    return userFriendlyAddress;
}

// Форматирование текста
export const formatText = (str) => {
  if(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().replace(/\n{2,}/g, '\n\n');
  } else {
    return null;
  }
}

// Сокращение ссылки
export const shortLink = (link) => {
  const regex = /(https?:\/\/)?(www\.)?(.*)/;
  const match = link.match(regex);
  const domain = match[3];
  const maxChars = 15; // максимальное количество символов в сокращенном доменном имени
  
  // сокращение доменного имени, если оно длиннее, чем maxChars
  if (domain.length > maxChars) {
    const shortened = domain.slice(0, maxChars) + '...';
    return shortened;
  }
  
  return domain;
}

// Склонения подписчиков и подписок
export const declension = (number, titles) => {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// Бесконечный скролл
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
//         if (documentHeight - scrollTop < windowHeight + 400 && currentPage < pages) { // Проверяем, что пользователь находится на расстоянии 300 пикселей от конца страницы
//             clearTimeout(delayTimerRef.current); // Очищаем таймер задержки
//             delayTimerRef.current = setTimeout(() => { // Запускаем новый таймер задержки
//                 handleAddPage();
//             }, 100); // Устанавливаем задержку в 100 миллисекунд
//         }
//     };
// };


export const useInfiniteScroll = (handleAddPage, currentPage, pages) => {
    const delayTimerRef = useRef(null);
  
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
      if (documentHeight - scrollTop < windowHeight + 400 && currentPage < pages) { // Добавляем проверку на isLoading
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = setTimeout(() => {
          handleAddPage()
        }, 170);
      }
    };
  };

// Бесконечный скролл в сообщениях
export const useInfiniteMessageScroll = (handleAddPage, currentPage, pages, scrollRef, wrapperRef) => {

    const element = wrapperRef.current;
    const delayTimerRef = useRef(null); // Создаем переменную для хранения таймера задержки
    
    const handleScroll = useCallback(() => {
        const scrollTop = element.scrollTop;
        if (scrollTop < 600 && currentPage < pages) {
            clearTimeout(delayTimerRef.current); // Очищаем таймер задержки
            delayTimerRef.current = setTimeout(() => { // Запускаем новый таймер задержки
                handleAddPage();
            }, 170); // Устанавливаем задержку в 500 миллисекунд
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

// Сокращение ссылки
export const shortenLink = (link, maxLength) => {
    if (link.length <= maxLength) {
      return link;
    } else {
      return link.substr(0, maxLength + 7) + '...';
    }
}

// // Поиск эмодзи и ссылок в тексте
// export const addLinksToText = (postData) => {
//     const regex = /(https?:\/\/[^\s]+)|(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)/ug;
//     let textWithLinksAndEmojis = '';
//     if (postData && postData.text) {
//         textWithLinksAndEmojis = postData.text.replace(regex, (match) => {
//             if (match.startsWith('http')) {
//                 const shortLink = shortenLink(match, 20);
//                 return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
//             } else {
//                 return `<span class="emoji">${match}</span>`;
//             }
//         });
//     }
//     return textWithLinksAndEmojis;
// }

// Поиск эмодзи, ссылок и хэштегов в тексте
// export const addLinksToText = (postData) => {
//     const regex = /(https?:\/\/[^\s]+)|#(\p{L}+)/ug;
//     let textWithLinksAndHashtags = '';
//     if (postData && postData.text) {
//         textWithLinksAndHashtags = postData.text.replace(regex, (match, p1, p2) => {
//             if (p1) {
//                 const shortLink = shortenLink(p1, 20);
//                 return `<a href="${p1}" title="${p1}" target="_blank">${shortLink}</a>`;
//             } else {
//                 return `<a href="/feed?query=%23${p2}">#${p2}</a>`;
//             }
//         });
//     }
//     return textWithLinksAndHashtags;
// }

// Поиск хэштегов и ссылок в тексте
// export const addLinksToPost = (textData) => {
//     if (!textData) return textData;
//     const regex = /(https?:\/\/[^\s]+)|#(\p{L}+)/ug;
//     const textWithLinksAndHashtags = textData.replace(regex, (match, p1, p2) => {
//         if (p1) {
//             const shortLink = shortenLink(p1, 20);
//             return `<a href=${p1} title=${p1} target="_blank">${shortLink}</a>`;
//         } else {
//             return `<a href=/feed?query=%23${p2}>#${p2}</a>`;
//         }
//     });
//     return textWithLinksAndHashtags;
// };


// // Поиск эмодзи и ссылок в статусах
// export const addLinksToStatus = (textData) => {
//     if (!textData) return textData;
//     const regex = /(https?:\/\/[^\s]+)/ug;
//     const textWithLinks = textData.replace(regex, (match) => {
//         if (match.startsWith('http')) {
//             const shortLink = shortenLink(match, 20);
//             return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
//         }
//     });
//     return textWithLinks;
// }

// // Поиск эмодзи и ссылок в сообщениях
// export const addLinksToDialogs = (textData) => {
//     const regex = /(https?:\/\/[^\s]+)|(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)/ug;
//     const textWithLinksAndEmojis = textData.replace(regex, (match) => {
//         if (match.startsWith('http')) {
//             const shortLink = shortenLink(match, 20);
//             return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
//         } else {
//             return `<span class="emoji">${match}</span>`;
//         }
//     });
//     return textWithLinksAndEmojis;
// }

// Оборачивание эмодзи в диалогах
// export const wrapEmojisInSpan = (text) => {
//     const regex = /(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)/ug;
//     //const regex = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F170}-\u{1F251}])/gu;
//     const parts = text.split(regex);
//     return parts.map((part, index) => {
//       if (regex.test(part)) {
//         return <span key={index} className="emoji">{part}</span>;
//       }
//       return part;
//     });
// }