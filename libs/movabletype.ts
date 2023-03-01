import * as utils from "./utils.ts";
import { deno_dom, sleep } from "./deps.ts";

export default class movabletype {
  readonly TAG_URL =
    "https://www.movabletype.jp/documentation/appendices/tags/";
  readonly TAG_SELECTOR = "ul.entrylist-with-topborder > li";
  readonly TAG_DETAIL_SELECTOR = "div.content-main > article.entry-detail";
  readonly MODIFIER_URL =
    "https://www.movabletype.jp/documentation/appendices/modifiers/";
  readonly MODIFIER_SELECTOR = "ul.entrylist-with-topborder > li";
  readonly FILENAME = "./data/movabletype.json";

  readonly main = async () => {
    // タグのアイテム配列を作る
    const _tagItems = await this.makeTagItems();
    // モディファイアのアイテム配列を作る
    const _modifierItems = await this.makeModifierItems();

    // ふたつを合体してthis.filenameに書き込む
    utils.writeItems(this.FILENAME, _tagItems, _modifierItems);
  };

  /**
   * モディファイアのTItemsを作る。
   * fetch 1回
   * @returns
   */
  readonly makeModifierItems = async (): Promise<utils.TItems> => {
    const document = await utils.fetchDocument(this.MODIFIER_URL);
    const nodeList = document.querySelectorAll(this.MODIFIER_SELECTOR);

    const items: utils.TItems = {};
    nodeList.forEach((_node, index) => {
      const li = document.querySelector(
        `${this.MODIFIER_SELECTOR}:nth-child(${index})`,
      );
      if (!li) return utils.dummyItem;
      const item: utils.TItem = {
        name: li.querySelector("h2 > a")?.textContent || "",
        type: "global",
        description: li.querySelector("p")?.textContent || "",
        url: li.querySelector("h2 > a")?.getAttribute("href") || "",
        modifiers: {},
      };
      items[item.name] = item;
    });

    return items;
  };

  /**
   * タグのTItemsを作る
   * fetch 1 + {タグの数}回
   * @returns
   */
  readonly makeTagItems = async (): Promise<utils.TItems> => {
    const document = await utils.fetchDocument(this.TAG_URL);
    const nodeList = document.querySelectorAll(this.TAG_SELECTOR);

    const nameAndURL: utils.TNameAndURL[] = Object.values(
      nodeList,
    ).map(
      (_node, index) => {
        const li = document.querySelector(
          `${this.TAG_SELECTOR}:nth-child(${index + 1})`,
        );
        const url = li?.querySelector("h2 > a")?.getAttribute("href") || "";
        const name = li?.querySelector("h2 > a")?.textContent || "";
        return { url: url, name: name };
      },
    );
    console.log(`${nameAndURL.length}個のタグアイテムが見つかりました。`);

    // 100個づつの配列にする
    const hundred = utils.divideIntoHundredPieces(nameAndURL);

    console.log(`100個づつ${hundred.length}回にわけてfetchを実行します。`);
    let _tagItemArray: Array<utils.TItem> = [];
    for (let i = 0; i < hundred.length; i++) {
      console.log(`hundred[${i}].length = ${hundred[i].length}`);
      console.log(`n秒待機`);
      await sleep(3);
      const itemsArray = await Promise.all(
        hundred[i].map(async (item) => {
          // console.log(item.name);
          return await this.makeTagItem(item.url, item.name);
        }),
      );
      _tagItemArray = Array.prototype.concat(_tagItemArray, itemsArray);
    }

    const items: utils.TItems = {};
    _tagItemArray.forEach((item) => {
      if (!item) return;
      items[item.name.toLowerCase()] = item;
    });

    return items;
  };

  /**
   * urlからTItemを作る
   * @param url
   * @returns
   */
  readonly makeTagItem = async (
    url: string,
    name: string,
  ): Promise<utils.TItem> => {
    let cc;
    try {
      cc = await utils.fetchElement(url, this.TAG_DETAIL_SELECTOR);
    } catch (_error) {
      // console.log(error.message);
      const dummy = Object.assign({}, utils.dummyItem);
      dummy.name = utils.normalizeTagName(name);
      dummy.url = url;
      return dummy;
    }
    const contents = cc;

    const item: utils.TItem = {
      name: utils.normalizeTagName(
        contents.querySelector("h1.entry-title > span.name")?.textContent ||
          "",
      ),
      type: utils.discriminateType(
        contents.querySelector("h1.entry-title .labels")?.textContent ||
          "undefined",
      ),
      description: utils.descriptionEscapeHTML(
        contents.querySelectorAll(
          "section.entry-body p, section.entry-body pre",
        ),
      ),
      url: url,
      modifiers: this.makeTagModifiers(
        contents.querySelectorAll("section.entry-modifier > dl > dt"),
        contents.querySelectorAll("section.entry-modifier > dl > dd"),
      ),
    };

    return item;
  };

  /**
   * dt, ddからModifierを作る
   * FIX: https://www.movabletype.jp/documentation/appendices/tags/archivelist.html
   *    の１つ目のモディファイアが適切に取得できていない部分があるのでいずれ直す。放置でもいいと思う
   * FIX: https://www.movabletype.jp/documentation/appendices/tags/assets.html
   *    のモディファイアがdtが連続しているところがあって適切に取得できていない
   * @param dt
   * @param dd
   * @returns
   */
  readonly makeTagModifiers = (
    dt: deno_dom.NodeList,
    dd: deno_dom.NodeList,
  ): utils.TModifiers => {
    const modifiers: utils.TModifiers = {};

    dt.forEach((node, i): void => {
      const modifier = node.textContent;
      const [modifierName, modifierValue] = modifier.split("=");

      modifiers[modifierName] = {
        name: modifierName,
        type: "local",
        description: utils.textFormat(dd[i]?.textContent || ""),
        value: modifierValue?.replace(/"/g, ""),
      };
    });

    return modifiers;
  };
}
