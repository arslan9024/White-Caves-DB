export function findWord(word, sentence) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = sentence.match(pattern);
    if (matches === null) {
        return `No results`;
    }
    return `${matches} - ${matches.length} result(s) found.`;
}