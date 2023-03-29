import { deno_dom, isURL } from "./deps.ts";
import { GlobalModifier, Tag, TItem, TTagType } from "./item.ts";

export type TItems = {
  [string: string]: TItem;
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
  fetch = "fetch error in ",
}
export type TNameAndURL = { name: string; url: string };

/**
 * @param url
 * @returns
 * @throws invalid url
 */
export const fetchDocument = async (
  url: string,
): Promise<deno_dom.HTMLDocument> => {
  if (!isURL(url)) {
    throw new Error(ERROR_MESSAGES.url);
  }

  let temp_res;
  try {
    temp_res = await fetch(url);
  } catch (error) {
    console.log(error.message);
    throw new Error(ERROR_MESSAGES.fetch + url);
    // temp_res = await setTimeout(async () => {
    //   return await fetch(url);
    // }, 10);
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
export const fetchElement = async (
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
  if (name.search(/mt(app)?:?\w+/i) < 0) {
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
export const discriminateType = (type: string): TTagType => {
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
    if (!desc.match(/^\s*$/)) { //改行だけの行は飛ばす
      description.push(textFormat(desc));
    }
  });
  return description.join("\n");
};

/**
 * 1. 先頭の空白を消去
 * 1. 先頭のコロン:を消去
 * 2. 全ての改行を消去
 * 3. ２つ以上の連続する空白を空白１つに置換
 * 4. 末尾の空白を消去
 * @param description
 * @returns
 */
export const textFormat = (description: string): string => {
  return description
    .replace(/^\s*/, "")
    .replace(/^[:：]\s*/, "")
    .replace(/[\n]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*$/, "");
};

export const writeArr = async (
  filename: string,
  arr: Array<Tag | GlobalModifier>,
) => {
  if (!filename.match(/\.json$/)) {
    throw new Error(ERROR_MESSAGES.filename);
  }
  const items: TItems = {};
  arr.forEach((item) => {
    items[item.name.toLowerCase()] = item;
  });

  return await Deno.writeTextFile(filename, JSON.stringify(items));
};

/**
 * @param filename
 * @param tagItems
 * @param modifierItems
 * @returns
 * @throws invalid filename, no items
 */
export const writeItems = async (
  filename: string,
  tagArray: Array<Tag>,
  modifierArray: Array<GlobalModifier>,
) => {
  if (!filename.match(/\.json$/)) {
    throw new Error(ERROR_MESSAGES.filename);
  }
  if (tagArray.length === 0 && modifierArray.length === 0) {
    throw new Error(ERROR_MESSAGES.item);
  }
  const items: TItems = {};
  tagArray.forEach((tag) => {
    items[tag.name.toLowerCase()] = tag;
  });
  modifierArray.forEach((modifier) => {
    items[modifier.name.toLowerCase()] = modifier;
  });

  delete items[dummyTag.name.toLowerCase()];

  return await Deno.writeTextFile(filename, JSON.stringify(items));
};

export const dummyTag = new Tag(
  "MTDummy",
  "undefined",
  "dummy description",
  "dummy url",
  {},
);

/**
 * デフォルトで100個づつに分割して配列を返す
 * @param nameAndURL
 * @param divide_by
 * @returns
 */
export const divideIntoHundredPieces = (
  nameAndURL: TNameAndURL[],
  divide_by = 100,
): TNameAndURL[][] => {
  const hundred: TNameAndURL[][] = new Array(
    Math.floor(nameAndURL.length / divide_by) + 1,
  );
  for (let i = 0; i < hundred.length; i++) {
    const arr_length = (hundred.length - 1 === i)
      ? nameAndURL.length - divide_by * i
      : divide_by;
    const tempArray = new Array(arr_length);
    for (let j = 0; j < divide_by; j++) {
      if (!nameAndURL[divide_by * i + j]) {
        break;
      }
      tempArray[j] = nameAndURL[divide_by * i + j];
    }
    hundred[i] = tempArray;
  }
  return hundred;
};
