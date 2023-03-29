import { asserts } from "./testDeps.ts";
import movabletype_net from "../libs/movabletype_net.ts";
import { movabletype_net_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";
import { TGlobalModifiers, TTags } from "../libs/item.ts";

/**
 * --------------------------------
 * property check
 * --------------------------------
 */
Deno.test("property", () => {
  const cms = new movabletype_net();
  asserts.assertNotEquals(cms.TAG_URL, "");
  asserts.assertNotEquals(cms.TAG_SELECTOR, "");
  asserts.assertNotEquals(cms.TAG_DETAIL_SELECTOR, "");
  asserts.assertNotEquals(cms.MODIFIER_URL, "");
  asserts.assertNotEquals(cms.MODIFIER_SELECTOR, "");
  asserts.assertNotEquals(cms.FILENAME, "");
});

/**
 * --------------------------------
 * makeTagItem()
 * --------------------------------
 */
Deno.test("makeTagItem_ok", async () => {
  // prepare
  const expected = movabletype_net_testData.expected_tag1;
  const url = expected.url;
  const name = expected.name;
  const cms = new movabletype_net();

  // execute
  const actual = await cms.makeTagItem(url, name);

  // assert
  // console.log(JSON.stringify(actual));
  asserts.assertEquals(actual.name, expected.name);
  asserts.assertEquals(actual.url, expected.url);
  asserts.assertEquals(actual.type, expected.type);
  asserts.assertEquals(actual.description, expected.description);
  asserts.assertEquals(actual.modifiers.id.name, expected.modifiers.id.name);
  asserts.assertEquals(actual.modifiers.id.value, expected.modifiers.id.value);
  asserts.assertEquals(actual.modifiers.id.type, expected.modifiers.id.type);
  asserts.assertEquals(
    actual.modifiers.id.description,
    expected.modifiers.id.description,
  );
});

/**
 * mt:asset
 */
Deno.test("makeLocalModifiers_ok", async () => {
  // prepare
  const expected = movabletype_net_testData.expected_tag1;
  const url = expected.url;
  const cms = new movabletype_net();
  const element = await utils.fetchElement(url, cms.TAG_DETAIL_SELECTOR);

  // execute
  const actual = cms.makeLocalModifiers(element);

  const mod = expected.modifiers.id;

  // assert
  asserts.assertEquals(actual.id.name, mod.name);
  asserts.assertEquals(actual.id.value, mod.value);
  asserts.assertEquals(
    actual.id.description,
    mod.description,
  );
});
/**
 * mt:IncludeBlock
 */
Deno.test("makeLocalModifiers_ok_IncludeBlock", async () => {
  // prepare
  const url = "https://movabletype.net/tags/2015/09/mtincludeblock.html";
  const cms = new movabletype_net();
  const element = await utils.fetchElement(url, cms.TAG_DETAIL_SELECTOR);

  // execute
  const actual = cms.makeLocalModifiers(element);

  // console.log(JSON.stringify(actual));

  // assert
  asserts.assertEquals(actual.var.name, "var");
  asserts.assertEquals(actual.var.value, "variable_foo");
  asserts.assertEquals(
    actual.var.description,
    'MTIncludeBlock ブロックタグで囲んだ内容を、指定した名前の変数に代入します。変数は読み込むテンプレートモジュールで参照できます。指定しない場合の初期変数名は contents です。 <mt:IncludeBlock module="banner" var="foo">Movable Type へようこそ！</mt:IncludeBlock> MTInclude ファンクションタグで以下のように記述した場合と同じ動作をします。 <$mt:Include module="banner" foo="Movable Type へようこそ！"$> ■banner テンプレートモジュールの内容 <h1><$mt:Var name="foo"$></h1><div class="asset-content entry-content" itemprop="articleBody"> <p>MovableType.net は、安全で効率的なウェブサイト運用を可能にする CMS プラットフォームです。</p></div>',
  );
});

Deno.test("makeTagArr_ok", async () => {
  // prepare.
  const expected = movabletype_net_testData.expected_tag2;
  const cms = new movabletype_net();

  // execute.
  const _actual = await cms.makeTagArr();

  // assert prepare
  const actual: TTags = {};
  _actual.forEach((tag) => {
    actual[tag.name.toLowerCase()] = tag;
  });
  const assertTag = actual["mtwebsitepath"];

  // assert
  asserts.assertEquals(assertTag.name, expected.name);
  asserts.assertEquals(assertTag.type, expected.type);
  asserts.assertEquals(assertTag.url, expected.url);
  asserts.assertEquals(assertTag.description, expected.description);
  asserts.assertEquals(assertTag.modifiers, expected.modifiers);
});

/**makeGlobalModifierArr */
Deno.test("makeGlobalModifierArr_ok", async () => {
  // prepare.
  const expected = movabletype_net_testData.expected_modifier1;
  const cms = new movabletype_net();

  // execute.
  const _actual = await cms.makeGlobalModifierArr();

  // assert prepare
  const actual: TGlobalModifiers = {};
  _actual.forEach((modifier) => {
    actual[modifier.name.toLowerCase()] = modifier;
  });
  const assertTag = actual["count_characters"];

  // assert
  asserts.assertEquals(assertTag.name, expected.name);
  asserts.assertEquals(assertTag.type, expected.type);
  asserts.assertEquals(assertTag.url, expected.url);
  asserts.assertEquals(assertTag.description, expected.description);
});
