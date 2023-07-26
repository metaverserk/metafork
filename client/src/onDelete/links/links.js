import { shortenLink } from '../shortenLink/shortenLink';

// export const addLinksToText = (postData) => {
//     // const regex = /(https?:\/\/[^\s]+)/g;
//     const regex = /(https?:\/\/[^\s]+)/g;
//     let textWithLinks = '';
//     if (postData && postData.text) {
//         textWithLinks = postData.text.replace(regex, (match) => {
//             const shortLink = shortenLink(match, 20);
//             return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
//         });
//     }
//     return textWithLinks;
// }

// export const addLinksToPost = (textData) => {
//     // const regex = /(https?:\/\/[^\s]+)/g;
//     const regex = /(https?:\/\/[^\s]+)/g;
//     const textWithLinks = textData.replace(regex, (match) => {
//         const shortLink = shortenLink(match, 20);
//         return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
//     });
//     return textWithLinks;
// }




export const addLinksToText = (postData) => {
    const regex = /(https?:\/\/[^\s]+)|(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)/ug;
    let textWithLinksAndEmojis = '';
    if (postData && postData.text) {
        textWithLinksAndEmojis = postData.text.replace(regex, (match) => {
            if (match.startsWith('http')) {
                const shortLink = shortenLink(match, 20);
                return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
            } else {
                return `<span class="emoji">${match}</span>`;
            }
        });
    }
    return textWithLinksAndEmojis;
}

export const addLinksToPost = (textData) => {
    const regex = /(https?:\/\/[^\s]+)|(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*)/ug;
    //const regex = /(https?:\/\/[^\s]+)|\p{Extended_Pictographic}/ug;
    const textWithLinksAndEmojis = textData.replace(regex, (match) => {
        if (match.startsWith('http')) {
            const shortLink = shortenLink(match, 20);
            return `<a href="${match}" title="${match}" target="_blank">${shortLink}</a>`;
        } else {
            return `<span class="emoji">${match}</span>`;
        }
    });
    return textWithLinksAndEmojis;
}