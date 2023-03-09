import { asserts } from "./testDeps.ts";
import movabletype from "../libs/movabletype.ts";
import { movabletype_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";

/**
 * --------------------------------
 * property check
 * modifierは実装する時にコメントアウトを外す
 * --------------------------------
 */
Deno.test("property", () => {
  const cms = new movabletype();
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
 * makeTagItems()
 * 攻撃的なプログラムなのであまりテストもしないように！！
 * --------------------------------
 */
// Deno.test("makeTagItems_ok", async () => {
//   // prepare
//   const expected_tag = movabletype_testData.expected_tag1;
//   const expected_mod = expected_tag.modifiers.sort;
//   const cms = new movabletype();

//   // execute
//   const items = await cms.makeTagItems();
//   const actual = items[expected_tag.name.toLowerCase()];

//   // assert
//   asserts.assertEquals(actual.name, expected_tag.name);
//   asserts.assertEquals(actual.url, expected_tag.url);
//   asserts.assertEquals(actual.type, expected_tag.type);
//   asserts.assertEquals(actual.description, expected_tag.description);
//   asserts.assertEquals(actual.modifiers.sort.name, expected_mod.name);
//   asserts.assertEquals(actual.modifiers.sort.value, expected_mod.value);
//   asserts.assertEquals(actual.modifiers.sort.description, expected_mod.description);
//   asserts.assertEquals(actual.modifiers.sort.type, expected_mod.type);
// });

/**
 * --------------------------------
 * makeModifierItems()
 * --------------------------------
 */
Deno.test("makeModifierItems_ok", async () => {
  // prepare
  const expected_modifier = movabletype_testData.expected_modifier;
  const cms = new movabletype();

  // execute
  const actual = await cms.makeModifierItems();

  // assert
  asserts.assertEquals(actual.capitalize.name, expected_modifier.name);
});

/**
 * --------------------------------
 * makeTagItems()
 * 攻撃的なプログラムなのであまりテストもしないように！！
 * --------------------------------
 */
Deno.test("makeTagItems_new_ng", async () => {
  // prepare
  const expected_tag = movabletype_testData.expected_tag1;
  const _expected_mod = expected_tag.modifiers.sort;
  const cms = new movabletype();

  // execute
  const items = await cms.makeTagItems();
  const arr = Object.values(items);

  // assert
  let c = 0;
  arr.forEach((item) => {
    console.log(`${c}.assert ` + item.name);
    asserts.assertNotEquals(item.description, utils.dummyItem.description);
    // MTAuthorFavoriteEntriesがBlockタグだけどクラスがついていないためtestできない
    // asserts.assertNotEquals(item.type, utils.dummyItem.type);
    c++;
  });
  // asserts.assertEquals(arr.length, 690);
});
