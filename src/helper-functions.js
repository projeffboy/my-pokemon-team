// Give it a word, it capitalizes it
export const capitalizeWord = word => word[0].toUpperCase() + word.slice(1);

// Give it like a phrase or sentence, and it capitalizes every word
export const capitalizeEveryWord = words =>
  words
    .split(" ")
    .map(word => capitalizeWord(word))
    .join(" ");
