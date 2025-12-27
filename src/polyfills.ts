if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function <T>(this: T[]) {
    return Array.from(this).reverse();
  };
}
