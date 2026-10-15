// Folds what typing in a dropdown ignores: case, accents, the width of letters,
// digits, and katakana (Japanese and Chinese IMEs type full-width), and hiragana
// versus katakana. NFKD splits off accents as marks, like MUI's default filter.
const searchText = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u3041-\u3096]/g, kana =>
      String.fromCharCode(kana.charCodeAt(0) + 0x60),
    )
    .toLowerCase();

// An Autocomplete filterOptions matching the typed text anywhere in stringify's
export const searchFilter =
  <T>(stringify: (option: T) => string) =>
  (options: T[], { inputValue }: { inputValue: string }) => {
    const input = searchText(inputValue);
    return input ?
        options.filter(option => searchText(stringify(option)).includes(input))
      : options;
  };
