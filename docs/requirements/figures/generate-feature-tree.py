"""Draws figures/feature-tree.svg from the text tree in 04-feature-model.md.

Run from docs/requirements: python3 figures/generate-feature-tree.py
"""
import html
import re

INK, LINE, NEW, FILL = "#222", "#888", "#1565c0", "#f3f3f3"
ROW, COL, PAD = 22, 250, 20


class Node:
    def __init__(self, name, kind="mandatory", tag="", depth=0):
        self.name, self.kind, self.tag, self.depth = name, kind, tag, depth
        self.children, self.group = [], ""
        self.y = 0.0


def parse(path):
    text = open(path).read()
    block = text.split("## 4.2 Feature tree")[1].split("```")[1].strip("\n").split("\n")
    root = Node(block[0].strip())
    stack, last, in_group = [root], root, False
    for line in block[1:]:
        node = re.match(r"^([| ]*)\+-- (.+?)\s+\((mandatory|optional)\)\s*(\[\w+\])?\s*$", line)
        group = re.search(r"(XOR|OR) group:(.*)$", line)
        if node:
            depth = len(node.group(1)) // 4 + 1
            new = Node(node.group(2), node.group(3), (node.group(4) or "").strip("[]"), depth)
            stack = stack[:depth]
            stack[-1].children.append(new)
            stack.append(new)
            last, in_group = new, False
        else:
            if group:
                last.group, items, in_group = group.group(1), group.group(2), True
            elif in_group:
                items = re.sub(r"^[| ]+", "", line)
            else:
                continue
            for item in filter(None, (part.strip() for part in items.split("|"))):
                tagged = re.match(r"^(.*?)\s*\[(\w+)\]$", item)
                name, tag = (tagged.group(1), tagged.group(2)) if tagged else (item, "")
                last.children.insert(
                    sum(1 for child in last.children if child.kind == "alternative"),
                    Node(name, "alternative", tag, last.depth + 1),
                )
    return root


def layout(node, row=[0]):
    if not node.children:
        node.y = row[0] * ROW
        row[0] += 1
    else:
        for child in node.children:
            layout(child)
        node.y = (node.children[0].y + node.children[-1].y) / 2
    return row[0]


def width(node):
    label = node.name + ("  " + node.tag if node.tag else "")
    return len(label) * 6.0 + 16


def draw(node, out):
    x, y = PAD + node.depth * COL, node.y + 90
    planned = node.tag.startswith("P")
    w = width(node)
    for child in node.children:
        cx, cy = PAD + child.depth * COL, child.y + 90
        mid = cx - 22
        out.append(f'<path d="M{x + w} {y} H{mid} V{cy} H{cx - 5}" fill="none" stroke="{LINE}"/>')
        if child.kind != "alternative":
            fill = INK if child.kind == "mandatory" else "#fff"
            out.append(f'<circle cx="{cx - 5}" cy="{cy}" r="4.5" fill="{fill}" stroke="{INK}"/>')
    alternatives = [child for child in node.children if child.kind == "alternative"]
    if alternatives:
        mid = PAD + (node.depth + 1) * COL - 22
        top, bottom = alternatives[0].y + 90, alternatives[-1].y + 90
        fill = INK if node.group == "OR" else "#fff"
        out.append(f'<rect x="{mid - 4}" y="{top - 4}" width="8" height="{bottom - top + 8}" rx="4" fill="{fill}" stroke="{INK}"/>')
        out.append(f'<text x="{mid - 8}" y="{top - 8}" font-size="10" text-anchor="end" fill="{INK}" font-weight="bold">{node.group}</text>')
    stroke, dash = (NEW, ' stroke-dasharray="5 3"') if planned else (LINE, "")
    fill = "#e3f0fc" if planned else (FILL if node.kind != "alternative" else "#fff")
    out.append(f'<rect x="{x}" y="{y - 9}" width="{w}" height="18" rx="4" fill="{fill}" stroke="{stroke}"{dash}/>')
    tag = f'<tspan fill="{NEW if planned else LINE}" font-size="10">  {node.tag}</tspan>' if node.tag else ""
    weight = ' font-weight="bold"' if node.depth < 2 else ""
    out.append(f'<text x="{x + 8}" y="{y + 4}" font-size="12" fill="{INK}"{weight}>{html.escape(node.name)}{tag}</text>')
    for child in node.children:
        draw(child, out)


def main():
    root = parse("04-feature-model.md")
    rows = layout(root)
    w, h = PAD * 2 + 4 * COL + 200, rows * ROW + 110
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="Feature tree of My Pokemon Team">',
        "<title>Feature tree of My Pokemon Team</title>",
        f'<rect width="{w}" height="{h}" fill="#fff"/>',
        f'<text x="{PAD}" y="28" font-size="18" font-weight="bold" fill="{INK}">Feature tree of My Pokemon Team</text>',
    ]
    x = PAD
    for kind, label in [("mandatory", "mandatory"), ("optional", "optional"), ("XOR", "XOR group: exactly one"), ("OR", "OR group: at least one"), ("planned", "planned (PF1 to PF7)"), ("tag", "R1: new in the redesign")]:
        if kind in ("mandatory", "optional"):
            out.append(f'<circle cx="{x + 5}" cy="52" r="4.5" fill="{INK if kind == "mandatory" else "#fff"}" stroke="{INK}"/>')
        elif kind in ("XOR", "OR"):
            out.append(f'<rect x="{x + 1}" y="43" width="8" height="18" rx="4" fill="{INK if kind == "OR" else "#fff"}" stroke="{INK}"/>')
        elif kind == "planned":
            out.append(f'<rect x="{x - 2}" y="44" width="14" height="16" rx="4" fill="#e3f0fc" stroke="{NEW}" stroke-dasharray="5 3"/>')
        else:
            out.append(f'<text x="{x - 2}" y="56" font-size="10" fill="{LINE}">R1</text>')
        out.append(f'<text x="{x + 18}" y="56" font-size="12" fill="{INK}">{label}</text>')
        x += len(label) * 6.6 + 50
    draw(root, out)
    out.append("</svg>")
    open("figures/feature-tree.svg", "w").write("\n".join(out) + "\n")
    print(rows, "rows", w, "x", h)


main()
