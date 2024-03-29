import { asserts } from "./testDeps.ts";
import movabletype from "../libs/movabletype.ts";
import { movabletype_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";
import { TGlobalModifiers } from "../item.ts";

/**
 * --------------------------------
 * makeTagItem()
 * --------------------------------
 */
Deno.test("makeTagItem_ok1", async () => {
  // prepare
  const expected_tag = movabletype_testData.expected_tag1;
  const expected_mod = expected_tag.modifiers.sort;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  asserts.assertEquals(item.name, expected_tag.name);
  asserts.assertEquals(item.url, expected_tag.url);
  asserts.assertEquals(item.type, expected_tag.type);
  asserts.assertEquals(item.description, expected_tag.description);
  asserts.assertEquals(item.modifiers.sort.name, expected_mod.name);
  asserts.assertEquals(item.modifiers.sort.value, expected_mod.value);
  asserts.assertEquals(
    item.modifiers.sort.description,
    expected_mod.description,
  );
  asserts.assertEquals(item.modifiers.sort.type, expected_mod.type);
});

Deno.test("makeTagItem_ok2", async () => {
  // prepare
  const expected_tag = movabletype_testData.expected_tag2;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  asserts.assertEquals(item.name, expected_tag.name);
  asserts.assertEquals(item.url, expected_tag.url);
  asserts.assertEquals(item.type, expected_tag.type);
  asserts.assertEquals(item.description, expected_tag.description);
});

Deno.test("makeTagItem_ng_invalid_url", async () => {
  // prepare
  const expected_tag = movabletype_testData.invalidUrlItem;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  asserts.assertEquals(item.name, expected_tag.name);
  asserts.assertEquals(item.url, expected_tag.url);
  asserts.assertEquals(item.type, expected_tag.type);
  asserts.assertEquals(item.description, expected_tag.description);
});

/**
 * --------------------------------
 * makeGlobalModifierArr()
 * --------------------------------
 * global modifierが取れているかのチェック
 */
Deno.test("makeGlobalModifierArr_ok", async () => {
  // prepare
  const expected_modifier = movabletype_testData.expected_modifier;
  const cms = new movabletype();

  // execute
  const arr = await cms.makeGlobalModifierArr();

  // assertion prepare
  const actual: TGlobalModifiers = {};
  arr.forEach((elm) => {
    actual[elm.name.toLowerCase()] = elm;
  });

  // assert
  asserts.assertEquals(actual.capitalize.name, expected_modifier.name);
});
/**
 * --------------------------------
 * makeGlobalModifierArr()
 * --------------------------------
 */
Deno.test("makeGlobalModifierArr_ok_default", async () => {
  // prepare
  const expected_modifier = movabletype_testData.expected_modifier2;
  const cms = new movabletype();

  // execute
  const _actual = await cms.makeGlobalModifierArr();

  // assertion prepare
  const items: TGlobalModifiers = {};
  _actual.forEach((elm) => {
    items[elm.name.toLowerCase()] = elm;
  });
  const actual = items["_default"];

  // assert
  asserts.assertEquals(actual.name, expected_modifier.name);
  asserts.assertEquals(actual.url, expected_modifier.url);
  asserts.assertEquals(actual.type, expected_modifier.type);
  asserts.assertEquals(actual.description, expected_modifier.description);
});

/**
 * --------------------------------
 * makeTagArr()
 * 攻撃的なプログラムなのであまりテストもしないように！！
 * --------------------------------
 */
Deno.test("makeTagArr_new_ng", async () => {
  // prepare
  const expected_tag = movabletype_testData.expected_tag1;
  const _expected_mod = expected_tag.modifiers.sort;
  const cms = new movabletype();

  // execute
  const arr = await cms.makeTagArr();

  // assert
  let c = 0;
  arr.forEach((item) => {
    console.log(`${c}.assert ` + item.name);
    asserts.assertNotEquals(item.description, utils.dummyTag.description);
    // ↓MTAuthorFavoriteEntriesがBlockタグだけどクラスがついていないためtestできない
    // assertNotEquals(item.type, utils.dummyItem.type);
    c++;
  });
  // asserts.assertEquals(arr.length, 690);
});
