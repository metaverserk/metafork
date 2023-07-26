export const wrapEmojisInSpan = (text) => {
    const regex = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F170}-\u{1F251}])/gu;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return <span key={index} className="emoji">{part}</span>;
      }
      return part;
    });
  }