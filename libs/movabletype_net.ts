import * as utils from "./utils.ts";
import { GlobalModifier, LocalModifier, Tag, TLocalModifiers } from "./item.ts";
import { deno_dom, sleep } from "./deps.ts";

export default class movabletype {
  readonly TAG_URL = "https://movabletype.net/tags/";
  readonly TAG_SELECTOR = "#support-top-navi li";
  readonly TAG_DETAIL_SELECTOR = "article#entry-detail";
  readonly MODIFIER_URL = "https://movabletype.net/tags/modifiers.html";
  readonly MODIFIER_SELECTOR = "li.hentry";
  readonly FILENAME = "./data/movabletype_net";

  readonly main = async () => {
    // タグのアイテム配列を作る
    const _tagArr = await this.makeTagArr();
    // モディファイアのアイテム配列を作る
    const _modifierArr = await this.makeGlobalModifierArr();

    // Tagの書き込み
    utils.writeArr(`${this.FILENAME}/tag.json`, _tagArr);
    // GlobalModifierの書き込み
    utils.writeArr(`${this.FILENAME}/modifier.json`, _modifierArr);
    // ふたつを合体してthis.filenameに書き込む
    utils.writeItems(`${this.FILENAME}.json`, _tagArr, _modifierArr);
  };

  /**
   * グローバルモディファイアの配列を作る
   * fetch 1回
   * @returns
   */
  readonly makeGlobalModifierArr = async (): Promise<Array<GlobalModifier>> => {
    const document = await utils.fetchDocument(this.MODIFIER_URL);
    const nodeList = document.querySelectorAll(this.MODIFIER_SELECTOR);

    const items: Array<GlobalModifier> = [];
    nodeList.forEach((_node, index) => {
      const li = document.querySelector(
        `${this.MODIFIER_SELECTOR}:nth-child(${index + 1})`,
      );
      if (!li) return;
      items.push(
        new GlobalModifier(
          li.querySelector("a")?.textContent || "",
          utils.descriptionEscapeHTML(
            li.querySelectorAll("span"),
          ),
          li.querySelector("a")?.getAttribute("href") || "",
        ),
      );
    });

    return items;
  };

  /**
   * TAG_URLのページにある全Tagの配列を返す
   * @returns
   */
  readonly makeTagArr = async (): Promise<Array<Tag>> => {
    const document = await utils.fetchDocument(this.TAG_URL);
    const nodeList = document.querySelectorAll(`${this.TAG_SELECTOR} > a`);

    const nameAndUrl: utils.TNameAndURL[] = [];
    nodeList.forEach((anchor) => {
      const url =
        anchor.parentElement?.querySelector("a")?.getAttribute("href") ||
        "";
      const name = anchor.textContent || "";
      // console.log(`name:${name},\n\turl:${url}`);
      nameAndUrl.push({ url: url, name: name });
    });

    // 100個づつの配列にする
    const hundred = utils.divideIntoHundredPieces(nameAndUrl);
    console.log(`100個づつ${hundred.length}回にわけてfetchを実行します。`);
    let _tagItemArray: Array<Tag> = [];

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

    return _tagItemArray;
  };

  /**
   * urlにアクセスして、タグの詳細情報とモディファイアを取得してTagクラスを返す
   * @param url
   * @param name
   * @returns
   */
  readonly makeTagItem = async (
    url: string,
    name: string,
  ): Promise<Tag> => {
    let cc;
    try {
      cc = await utils.fetchElement(url, this.TAG_DETAIL_SELECTOR);
    } catch (_error) {
      console.log(_error.message);
      return new Tag(
        utils.dummyTag.name,
        "undefined",
        utils.dummyTag.description,
        utils.dummyTag.url,
        {},
      );
    }
    const contents = cc;

    return new Tag(
      utils.normalizeTagName(
        contents.querySelector("h1")?.textContent || name,
      ),
      "undefined",
      utils.descriptionEscapeHTML(
        contents.querySelectorAll("h1 + p"),
      ),
      url,
      this.makeLocalModifiers(contents),
    );
  };

  /**
   * HTMLDocumentを受け取ってTagに付属するモディファイアを返す。
   * なければ空のObjectを返す。
   * @param contents deno_dom.HTMLDocument
   */
  readonly makeLocalModifiers = (
    contents: deno_dom.Element,
  ): TLocalModifiers => {
    const modifierBlock = contents.querySelectorAll(
      "div.modifier-block dl dt",
    );
    if (!modifierBlock) {
      return {};
    }

    const modifiers: TLocalModifiers = {};

    modifierBlock.forEach((node, index) => {
      // console.log(node.nodeName);
      if (node.nodeName === "DD") return;
      const dt = contents.querySelector(
        `div.modifier-block dt:nth-of-type(${index + 1})`,
      );
      const dd = contents.querySelectorAll(
        `div.modifier-block dt:nth-of-type(${index + 1}) + dd`,
      );
      const [name, value] = (dt?.textContent || "").split("=");
      const description = utils.descriptionEscapeHTML(dd);
      modifiers[name.toLowerCase()] = new LocalModifier(
        name,
        description,
        (value || "").replace(/"/g, ""),
      );
    });

    return modifiers;
  };
}
