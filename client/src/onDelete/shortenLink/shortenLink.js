export const shortenLink = (link, maxLength) => {
    if (link.length <= maxLength) {
      return link;
    } else {
      return link.substr(0, maxLength + 7) + '...';
    }
}