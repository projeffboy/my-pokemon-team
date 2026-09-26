import { Fragment, type ReactNode } from "react";

// Replaces each {placeholder} in a message with a value, which may be an element such as a link.
// E.g. fill("Paste it into {showdown}.", { showdown: <Link>Showdown</Link> })
export default function fill(
  message: string,
  values: Record<string, ReactNode>,
): ReactNode {
  return message.split(/(\{[a-zA-Z]+\})/).map((part, i) => {
    const key = /^\{([a-zA-Z]+)\}$/.exec(part)?.[1];
    return (
      <Fragment key={i}>{key && key in values ? values[key] : part}</Fragment>
    );
  });
}
