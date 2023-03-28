import * as utils from "./utils.ts";
import { GlobalModifier, LocalModifier, Tag, TLocalModifiers } from "./item.ts";
import { deno_dom, sleep } from "./deps.ts";

export default class movabletype {
  readonly TAG_URL =
    "https://www.movabletype.jp/documentation/appendices/tags/";
  readonly TAG_SELECTOR = "ul.entrylist-with-topborder > li";
  readonly TAG_DETAIL_SELECTOR = "div.content-main > article.entry-detail";
  readonly MODIFIER_URL =
    "https://www.movabletype.jp/documentation/appendices/modifiers/";
  readonly MODIFIER_SELECTOR = "ul.entrylist-with-topborder > li";
  readonly FILENAME = "./data/movabletype/";

  readonly main = async () => {
    // タグのアイテム配列を作る
    const _tagItems = await this.makeTagArr();
    // モディファイアのアイテム配列を作る
    const _modifierItems = await this.makeGlobalModifierArr();

    // ふたつを合体してthis.filenameに書き込む
    utils.writeArr(`${this.FILENAME}tag.json`, _tagItems);

    utils.writeArr(`${this.FILENAME}modifier.json`, _modifierItems);

    utils.writeItems(`./data/movabletype.json`, _tagItems, _modifierItems);
  };

  /**
   * グローバルモディファイアの配列を作る。
   * fetch 1回
   * @returns
   */
  readonly makeGlobalModifierArr = async (): Promise<Array<GlobalModifier>> => {
    const document = await utils.fetchDocument(this.MODIFIER_URL);
    const nodeList = document.querySelectorAll(this.MODIFIER_SELECTOR);

    const items: Array<GlobalModifier> = [];
    nodeList.forEach((_node, index) => {
      const li = document.querySelector(
        `${this.MODIFIER_SELECTOR}:nth-child(${index})`,
      );
      if (!li) return;
      const item = new GlobalModifier(
        li.querySelector("h2 > a")?.textContent || "",
        li.querySelector("p")?.textContent || "",
        li.querySelector("h2 > a")?.getAttribute("href") || "",
      );
      items.push(item);
    });

    return items;
  };

  /**
   * タグのutils.TItemsを作る
   * fetch 1 + {タグの数}回
   * @returns
   */
  readonly makeTagArr = async (): Promise<Array<Tag>> => {
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
   * urlからTItemを作る
   * @param url
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
      // console.log(error.message);
      return new Tag(
        utils.normalizeTagName(name),
        "undefined",
        utils.dummyTag.description,
        url,
        {},
      );
    }
    const contents = cc;

    return new Tag(
      utils.normalizeTagName(
        contents.querySelector("h1.entry-title > span.name")?.textContent ||
          "",
      ),
      utils.discriminateType(
        contents.querySelector("h1.entry-title .labels")?.textContent ||
          "undefined",
      ),
      utils.descriptionEscapeHTML(
        contents.querySelectorAll(
          "section.entry-body p, section.entry-body pre",
        ),
      ),
      url,
      this.makeTagModifiers(
        contents,
        // contents.querySelectorAll("section.entry-modifier > dl > dt"),
        // contents.querySelectorAll("section.entry-modifier > dl > dd"),
      ),
    );
  };

  /**
   * dt, ddからModifierを作る
   * FIX: https://www.movabletype.jp/documentation/appendices/tags/archivelist.html
   *    の１つ目のモディファイアが適切に取得できていない部分があるのでいずれ直す。放置でもいいと思う
   * FIX: https://www.movabletype.jp/documentation/appendices/tags/assets.html
   *    のモディファイアがdtが連続しているところがあって適切に取得できていない
   * @param element
   * @returns
   */
  readonly makeTagModifiers = (element: deno_dom.Element): TLocalModifiers => {
    // console.log(element.textContent);
    const modifierBlock = element.querySelectorAll(
      `section.entry-modifier > dl > dt`,
    );
    if (modifierBlock.length === 0) {
      return {};
    }
    const modifiers: TLocalModifiers = {};

    modifierBlock.forEach((_node, index) => {
      const dt = element.querySelector(
        `section.entry-modifier > dl > dt:nth-of-type(${index + 1})`,
      );
      const dd = element.querySelectorAll(
        `section.entry-modifier > dl > dt:nth-of-type(${index + 1}) + dd`,
      );
      const [name, value] = (dt?.textContent || "").split("=");
      console.log(`name:${name}, value:${value}`);
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
