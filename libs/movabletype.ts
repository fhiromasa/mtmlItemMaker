import * as utils from "./utils.ts";
import { deno_dom } from "./deps.ts";

export default class movabletype {
  readonly TAG_URL =
    "https://www.movabletype.jp/documentation/appendices/tags/";
  readonly TAG_SELECTOR = "ul.entrylist-with-topborder > li";
  readonly TAG_MODIFIER_SELECTOR = "div.content-main > article.entry-detail";
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

    const items: utils.TItems = {};
    const tagItemArray: Array<utils.TItem> = await Promise.all(
      Object.values(nodeList).map(
        async (_node, index): Promise<utils.TItem> => {
          const li = document.querySelector(
            `${this.TAG_SELECTOR}:nth-child(${index})`,
          );
          const url = li?.querySelector("h2 > a")?.getAttribute("href");
          const name = li?.querySelector("h2 > a")?.textContent || "";

          if (!url) return utils.dummyItem;

          const item = await this.makeTagItem(url, name);
          return item;
        },
      ),
    );
    tagItemArray.forEach((item) => {
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
      cc = await utils.fetchElement(url, this.TAG_MODIFIER_SELECTOR);
    } catch (error) {
      console.log(error.message);
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
