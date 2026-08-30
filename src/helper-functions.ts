// Give it a word, it capitalizes it
export const capitalizeWord = (word: string) =>
  word ? word[0].toUpperCase() + word.slice(1) : word;
