import * as utils from "./utils.ts";
import { deno_dom, sleep } from "./deps.ts";

export default class movabletype {
  readonly TAG_URL = "https://movabletype.net/tags/";
  readonly TAG_SELECTOR = "#support-top-navi li";
  readonly TAG_DETAIL_SELECTOR = "article#entry-detail";
  readonly MODIFIER_URL = "";
  readonly MODIFIER_SELECTOR = "";
  readonly FILENAME = "./data/movabletype_net.json";

  readonly main = async () => {
    await sleep(1);
    // タグのアイテム配列を作る
    // const _tagItems = await this.makeTagItems();
    // モディファイアのアイテム配列を作る
    // const _modifierItems = await this.makeModifierItems();

    // ふたつを合体してthis.filenameに書き込む
    utils.writeItems(this.FILENAME, {}, {});
  };

  readonly makeTagItems = async (): Promise<utils.TItems> => {
    const document = await utils.fetchDocument(this.TAG_URL);
    const nodeList = document.querySelectorAll(this.TAG_SELECTOR);

    const items: utils.TItems = {};
    items["MTdummy".toLowerCase()] = utils.dummyItem;
    return items;
  };

  readonly makeTagItem = async (
    url: string,
    name: string,
  ): Promise<utils.TItem> => {
    let cc;
    try {
      cc = await utils.fetchElement(url, this.TAG_DETAIL_SELECTOR);
    } catch (_error) {
      console.log(_error.message);
      const dummy = Object.assign({}, utils.dummyItem);
      dummy.name = utils.normalizeTagName(name);
      dummy.url = url;
      return dummy;
    }
    const contents = cc;
    const item: utils.TItem = {
      name: utils.normalizeTagName(
        contents.querySelector("h1")?.textContent || "",
      ),
      url: url,
      type: "undefined",
      description: utils.descriptionEscapeHTML(
        contents.querySelectorAll("h1 + p"),
      ),
      modifiers: {},
    };
    return item;
  };

  /**
   * HTMLDocumentを受け取ってTagに付属するモディファイアを返す。
   * なければ空のObjectを返す。
   * @param document deno_dom.HTMLDocument
   */
  readonly makeTagModifiers = (
    document: deno_dom.HTMLDocument,
  ): utils.TModifiers => {
    const modifierBlock = document.querySelectorAll(
      "div.modifier-block dt",
    );
    if (!modifierBlock) {
      return {};
    }
    const modifierArr: Array<utils.TModifier> = [];
    modifierBlock.forEach((node, index) => {
      console.log(node.nodeName);
      if (node.nodeName === "DD") return;
      const dt = document.querySelector(
        `div.modifier-block dt:nth-of-type(${index})`,
      );
      const dd = document.querySelectorAll(
        `div.modifier-block dt:nth-of-type(${index})+dd`,
      );
      const [name, value] = (dt?.textContent || "").split("=");
      const description = utils.descriptionEscapeHTML(dd);
      modifierArr.push({
        name: name,
        value: value,
        type: "local",
        description: description,
      });
    });

    const modifiers: utils.TModifiers = {};
    modifierArr.forEach((mod) => {
      modifiers[mod.name.toLowerCase()] = mod;
    });

    return modifiers;
  };
}
