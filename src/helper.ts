// Give it a word, it capitalizes it
export const capitalizeWord = (word: string) =>
  word[0].toUpperCase() + word.slice(1);

// Give it like a phrase or sentence, and it capitalizes every word
export const capitalizeEveryWord = (words: string) =>
  words
    .split(" ")
    .map((word: string) => capitalizeWord(word))
    .join(" ");

// export const matchHeightToFontSizeOf =
//   (variant: keyof Theme["typography"]) =>
//   ({ theme }: { theme: Theme }): CSSObject => {
//     const typographyStyle = theme.typography[variant];

//     // Ensure we have a style object to work with
//     if (!typographyStyle || typeof typographyStyle !== "object") {
//       return {};
//     }

//     const styles: CSSObject = {
//       height: typographyStyle.fontSize,
//     };

//     // account for media queries
//     for (const [key, value] of Object.entries(typographyStyle)) {
//       if (typeof value === "object" && value !== null && "fontSize" in value) {
//         styles[key] = {
//           height: value.fontSize,
//         };
//       }
//     }

//     return styles;
//   };
