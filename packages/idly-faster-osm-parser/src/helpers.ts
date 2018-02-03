export interface Options {
  // flag for prepending `n`, `w`, `r` to the id of entity
  prependEntityChar?: boolean;
  // when true uses `ref` key for uniquely identifying a member
  // when false uses `id` key for uniquely identifying a member
  useRef?: boolean;
  // deep freezes each entity
  freeze?: boolean;
}

export function parseAttributes(s: string) {
  return s
    .split('"')
    .reduce(
      (prev, val, index, arr) => {
        if (index % 2 === 1) {
          const key = arr[index - 1];
          prev.push([
            // key comes in the format '<node k=' or ' k='
            key.slice(key.lastIndexOf(' ') + 1, key.length - 1),
            val,
          ]);
        }
        return prev;
      },
      [] as Array<[string, string]>
    )
    .reduce(
      (prev, cur) => {
        prev[cur[0]] = cur[1];
        return prev;
      },
      {} as { [index: string]: string }
    );
}

export function prependEntityChar(id: string, type: string, flag?: boolean) {
  if (!flag) {
    return id;
  }
  return type.charAt(0) + id;
}

export function parseVisibility(attr: any): boolean {
  attr.visible = !attr.visible || attr.visible !== 'false' ? true : false;
  return attr;
}

const htmlUnescapes: {
  [index: string]: string;
} = {
  '&#39;': "'",
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&quot;': '"',
};

const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);

export function unescape(str: string): string {
  return str && reHasEscapedHtml.test(str)
    ? str.replace(reEscapedHtml, entity => htmlUnescapes[entity])
    : str;
}
