// Give it a word, it capitalizes it
export const capitalizeWord = (word: string) =>
  word ? word[0].toUpperCase() + word.slice(1) : word;

// Give it like a phrase or sentence, and it capitalizes every word
export const capitalizeEveryWord = (words: string) =>
  words
    .split(" ")
    .map(word => capitalizeWord(word))
    .join(" ");
