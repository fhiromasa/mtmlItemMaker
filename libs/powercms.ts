import * as utils from "./utils.ts";
import {
  GlobalModifier,
  LocalModifier,
  Tag,
  TLocalModifiers,
} from "../item.ts";
import { deno_dom, sleep } from "./deps.ts";

export default class powercms {
  readonly TAG_URL = "https://www.powercms.jp/products/document/template-tags/";
  readonly TAG_SELECTOR = "ul.listBlock > li";
  readonly TAG_DETAIL_SELECTOR = "div#primary";
  readonly MODIFIER_URL =
    "https://www.powercms.jp/products/document/modifiers/";
  readonly MODIFIER_SELECTOR = "dl.listBlock dt";
  readonly FILENAME = "./powercms";

  readonly main = async () => {
    // タグの配列を作る
    const _tagItems = await this.makeTagArr();
    // モディファイアのアイテム配列を作る
    const _modifierItems = await this.makeGlobalModifierArr();

    // ふたつを合体してthis.filenameに書き込む
    utils.writeArr(`${this.FILENAME}/tag.json`, _tagItems);

    utils.writeArr(`${this.FILENAME}/modifier.json`, _modifierItems);

    utils.writeItems(`${this.FILENAME}.json`, _tagItems, _modifierItems);
  };

  readonly makeGlobalModifierArr = async (): Promise<Array<GlobalModifier>> => {
    const document = await utils.fetchDocument(this.MODIFIER_URL);
    const nodeList = document.querySelectorAll(this.MODIFIER_SELECTOR);

    const items: Array<GlobalModifier> = [];
    nodeList.forEach((_node, index) => {
      const dt = document.querySelector(
        `${this.MODIFIER_SELECTOR}:nth-of-type(${index + 1})`,
      );
      const dd = document.querySelectorAll(
        `${this.MODIFIER_SELECTOR}:nth-of-type(${index + 1}) + dd`,
      );
      if (!dt) return;

      items.push(
        new GlobalModifier(
          dt.querySelector("a")?.textContent || "",
          utils.descriptionEscapeHTML(dd),
          dt.querySelector("a")?.getAttribute("href") || this.MODIFIER_URL,
        ),
      );
    });
    return items;
  };

  readonly makeTagArr = async (): Promise<Array<Tag>> => {
    const document = await utils.fetchDocument(this.TAG_URL);
    const nodeList = document.querySelectorAll(`${this.TAG_SELECTOR} > a`);

    const nameAndUrl: utils.TNameAndURL[] = [];
    nodeList.forEach((anchor) => {
      const url =
        anchor.parentElement?.querySelector("a")?.getAttribute("href") || "";
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
        name,
        "undefined",
        utils.dummyTag.description,
        url,
        {},
      );
    }
    const contents = cc;

    // KeywordsOfPage の先頭にMTがないのでつける
    let __name = contents.querySelector("h1")?.textContent || name;
    if (__name.search(/^mt/i) < 0) {
      __name = "MT" + __name;
    }

    return new Tag(
      utils.normalizeTagName(__name),
      utils.discriminateType(
        contents.querySelector("li.icoBlock")?.textContent ||
          contents.querySelector("li.icoFunction")?.textContent || "",
      ),
      utils.descriptionEscapeHTML(
        contents.querySelectorAll("div.moreInfo > p"),
      ),
      url,
      this.makeLocalModifiers(contents),
    );
  };

  /**
   * タグ詳細ページのコンテンツからmodifierを作る
   * @param contents
   * @returns
   */
  readonly makeLocalModifiers = (
    contents: deno_dom.Element,
  ): TLocalModifiers => {
    const modifierBlock = contents.querySelectorAll("div.moreInfo dl dt");
    if (!modifierBlock) return {};

    const modifiers: TLocalModifiers = {};

    modifierBlock.forEach((_node, index) => {
      const dt = contents.querySelector(
        `div.moreInfo dl > dt:nth-of-type(${index + 1})`,
      );
      const dd = contents.querySelectorAll(
        `div.moreInfo dl > dt:nth-of-type(${index + 1}) + dd`,
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
