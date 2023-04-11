import * as utils from "./utils.ts";
import {
  BlockTag,
  FunctionTag,
  GlobalModifier,
  LocalModifier,
  Tag,
  TLocalModifiers,
} from "./item.ts";
import { deno_dom } from "./deps.ts";

export default class powercms_x {
  readonly TAG_URL = "https://powercmsx.jp/about/mtml_reference.html";
  readonly TAG_SELECTOR = "";
  readonly TAG_DETAIL_SELECTOR = "";
  readonly MODIFIER_URL = "https://powercmsx.jp/about/mtml_reference.html";
  readonly MODIFIER_SELECTOR =
    "#searchBlock > div > div:nth-child(1) > table:nth-child(9) > tbody > tr";
  readonly FILENAME = "./data/powercms_x";

  readonly main = async () => {
    const tagItems = await this.makeTagArr();
    const modifierItems = await this.makeGlobalModifierArr();

    utils.writeArr(`${this.FILENAME}/tag.json`, tagItems);
    utils.writeArr(`${this.FILENAME}/modifier.json`, modifierItems);
    utils.writeItems(`${this.FILENAME}.json`, tagItems, modifierItems);
  };

  readonly makeGlobalModifierArr = async (): Promise<Array<GlobalModifier>> => {
    const document = await utils.fetchDocument(this.MODIFIER_URL);
    const nodeList = document.querySelectorAll(this.MODIFIER_SELECTOR);

    const items: GlobalModifier[] = [];
    nodeList.forEach((_node, index) => {
      const tr = document.querySelector(
        `${this.MODIFIER_SELECTOR}:nth-child(${index + 1})`,
      );
      if (!tr) return;
      const item = new GlobalModifier(
        tr.querySelector("td:nth-child(1)")?.childNodes[0].textContent.replace(
          /\n/g,
          "",
        ) || "",
        utils.descriptionEscapeHTML(tr.querySelectorAll("td:nth-child(2)")),
        `${this.MODIFIER_URL}#global_modifiers`,
      );
      items.push(item);
    });

    return items;
  };

  readonly makeTagArr = async (): Promise<Array<Tag>> => {
    const document = await utils.fetchDocument(this.TAG_URL);
    const block_selector = "#block_tags + table > tbody > tr";
    const block_nodeList = document.querySelectorAll(block_selector);
    const control_selector = "#conditional_tags + table > tbody > tr";
    const control_nodeList = document.querySelectorAll(control_selector);
    const function_selector = "#function_tags + table > tbody > tr";
    const function_nodeList = document.querySelectorAll(function_selector);

    const TagArr: Array<Tag> = [];

    // ブロックタグ
    block_nodeList.forEach((_node, index) => {
      const tr = document.querySelector(
        `${block_selector}:nth-child(${index + 1})`,
      );
      if (!tr) return;
      TagArr.push(
        new BlockTag(
          `mt${tr.className || ""}`,
          utils.descriptionEscapeHTML(tr.querySelectorAll("td:nth-child(2)")),
          "https://powercmsx.jp/about/mtml_reference.html#block_tags",
          this.makeTagModifiers(tr),
        ),
      );
    });
    // 条件タグ
    control_nodeList.forEach((_node, index) => {
      const tr = document.querySelector(
        `${control_selector}:nth-child(${index + 1})`,
      );
      if (!tr) return;
      TagArr.push(
        new Tag(
          `mt${tr.className || ""}`,
          "undefined",
          utils.descriptionEscapeHTML(tr.querySelectorAll("td:nth-child(2)")),
          "https://powercmsx.jp/about/mtml_reference.html#conditional_tags",
          this.makeTagModifiers(tr),
        ),
      );
    });
    // ファンクションタグ
    function_nodeList.forEach((_node, index) => {
      const tr = document.querySelector(
        `${function_selector}:nth-child(${index + 1})`,
      );
      if (!tr) return;
      TagArr.push(
        new FunctionTag(
          `mt${tr.className || ""}`,
          utils.descriptionEscapeHTML(tr.querySelectorAll("td:nth-child(2)")),
          "https://powercmsx.jp/about/mtml_reference.html#function_tags",
          this.makeTagModifiers(tr),
        ),
      );
    });

    return TagArr;
  };

  readonly makeTagModifiers = (
    element: deno_dom.Element,
  ): TLocalModifiers => {
    const ul = element.querySelector("td:nth-child(3) ul");

    const mods: TLocalModifiers = {};

    const li_nodeList = ul?.querySelectorAll("li");
    if (!li_nodeList) return mods;
    li_nodeList.forEach((_node, index) => {
      const li = ul?.querySelector(`li:nth-child(${index + 1})`);
      if (!li) return;
      const mod_name = li.querySelector("i")?.textContent || "";
      const mod = new LocalModifier(
        mod_name,
        utils.descriptionEscapeHTML(li.childNodes).replace(`${mod_name}\n`, ""),
        "",
      );
      mods[mod.name.toLowerCase()] = mod;
    });

    return mods;
  };
}
