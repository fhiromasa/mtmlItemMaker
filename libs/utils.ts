import { deno_dom, setTimeout } from "./deps.ts";

export type TItems = {
  [string: string]: TItem;
};
export type TItem = {
  name: string;
  url: string;
  type: TItemType;
  description: string;
  modifiers: TModifiers;
};
export type TItemType = "global" | "function" | "block" | "undefined";
export type TModifiers = {
  [string: string]: TModifier;
};
type TModifier = {
  name: string;
  type: "local";
  value: string;
  description: string;
};

export enum ERROR_MESSAGES {
  filename = "Invalid filename",
  url = "Invalid URL",
  selector = "Invalid selector",
  item = "No Items",
  type = "Could not classify TItemType",
  parse = "parseFromString returned null",
  nullSelector = "Selector has no element",
  notTagName = "is not tag name",
}

/**
 * @param url
 * @returns
 * @throws invalid url
 */
export const fetchDocument = async (
  url: string,
): Promise<deno_dom.HTMLDocument> => {
  if (!url) {
    throw new Error(ERROR_MESSAGES.url);
  }

  let temp_res;
  try {
    temp_res = await fetch(url);
  } catch (_error) {
    temp_res = await setTimeout(async () => {
      return await fetch(url);
    }, 10);
  }
  const res = temp_res;
  const html = await res.text();
  const document = new deno_dom.DOMParser().parseFromString(html, "text/html");
  if (!document) throw new Error(ERROR_MESSAGES.parse);
  return document;
};

/**
 * @param url
 * @param selector
 * @returns
 * @throws invalid selector or nullSelector
 */
export const elementFromURL = async (
  url: string,
  selector: string,
): Promise<deno_dom.Element> => {
  if (selector === "") {
    throw new Error(ERROR_MESSAGES.selector);
  }

  const document = await fetchDocument(url);

  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(ERROR_MESSAGES.nullSelector);
  }
  return element;
};

/**
 * 大体は綺麗なものを受け取れるから空白を取り除くだけで大丈夫
 * @param name
 * @returns
 * @throws notTagName
 */
export const normalizeTagName = (name: string): string => {
  if (!name.match(/mt(app)?:?\w+/i)) {
    throw new Error(name + ERROR_MESSAGES.notTagName);
  }

  const noneSpaceName = name
    .replace(/~.*/, "")
    .replace(/[\s:<>$\/\n]/g, "");
  return noneSpaceName;
};

/**
 * functionタグなのかblockタグなのかを判別します。
 * @param type
 * @returns
 */
export const discriminateType = (type: string): TItemType => {
  if (type.match(/function/i)) {
    return "function";
  }
  if (type.match(/block/i)) {
    return "block";
  }
  return "undefined";
};

/**
 * 以下の操作をした上でnodeListのテキストコンテントを改行で結合する
 * 1. 先頭の空白を消去
 * 2. 全ての改行を消去
 * 3. ２つ以上の連続する空白を空白１つに置換
 * 4. 末尾の空白を消去
 * @param description
 * @returns
 */
export const descriptionEscapeHTML = (nodeList: deno_dom.NodeList): string => {
  const description: Array<string> = [];
  nodeList.forEach((node) => {
    const desc = node.textContent;
    if (!desc.match(/^\s*$/)) {
      description.push(textFormat(desc));
    }
  });
  return description.join("\n");
};

/**
 * 1. 先頭の空白を消去
 * 2. 全ての改行を消去
 * 3. ２つ以上の連続する空白を空白１つに置換
 * 4. 末尾の空白を消去
 * @param description
 * @returns
 */
export const textFormat = (description: string): string => {
  return description
    .replace(/^\s*/, "")
    .replace(/[\n]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*$/, "");
};

export const dummyItem: TItem = {
  name: "dummy",
  type: "undefined",
  description: "dummy",
  url: "dummy",
  modifiers: {},
};
