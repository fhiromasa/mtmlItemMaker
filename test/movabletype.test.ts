import { assertEquals, assertNotEquals } from "./testDeps.ts";
import movabletype from "../libs/movabletype.ts";
import * as test_data from "./testData.ts";
import * as utils from "../libs/utils.ts";

/**
 * --------------------------------
 * property check
 * modifierは実装する時にコメントアウトを外す
 * --------------------------------
 */
Deno.test("property", () => {
  const cms = new movabletype();
  assertNotEquals(cms.TAG_URL, "");
  assertNotEquals(cms.TAG_SELECTOR, "");
  assertNotEquals(cms.MODIFIER_URL, "");
  assertNotEquals(cms.MODIFIER_SELECTOR, "");
  assertNotEquals(cms.FILENAME, "");
});

/**
 * --------------------------------
 * makeTagItem()
 * --------------------------------
 */
Deno.test("makeTagItem_ok1", async () => {
  // prepare
  const expected_tag = test_data.expected_tag1;
  const expected_mod = expected_tag.modifiers.sort;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  assertEquals(item.name, expected_tag.name);
  assertEquals(item.url, expected_tag.url);
  assertEquals(item.type, expected_tag.type);
  assertEquals(item.description, expected_tag.description);
  assertEquals(item.modifiers.sort.name, expected_mod.name);
  assertEquals(item.modifiers.sort.value, expected_mod.value);
  assertEquals(item.modifiers.sort.description, expected_mod.description);
  assertEquals(item.modifiers.sort.type, expected_mod.type);
});

Deno.test("makeTagItem_ok2", async () => {
  // prepare
  const expected_tag = test_data.expected_tag2;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  assertEquals(item.name, expected_tag.name);
  assertEquals(item.url, expected_tag.url);
  assertEquals(item.type, expected_tag.type);
  assertEquals(item.description, expected_tag.description);
});

Deno.test("makeTagItem_ng_invalid_url", async () => {
  // prepare
  const expected_tag = test_data.invalidUrlItem;
  const name = expected_tag.name;
  const url = expected_tag.url;
  const cms = new movabletype();

  // execute
  const item = await cms.makeTagItem(url, name);

  // assert
  assertEquals(item.name, expected_tag.name);
  assertEquals(item.url, expected_tag.url);
  assertEquals(item.type, expected_tag.type);
  assertEquals(item.description, expected_tag.description);
});

/**
 * --------------------------------
 * makeTagItems()
 * --------------------------------
 */
Deno.test("makeTagItems_ok", async () => {
  // prepare
  const expected_tag = test_data.expected_tag1;
  const expected_mod = expected_tag.modifiers.sort;
  const cms = new movabletype();

  // execute
  const items = await cms.makeTagItems();
  const actual = items[expected_tag.name.toLowerCase()];

  // assert
  assertEquals(actual.name, expected_tag.name);
  assertEquals(actual.url, expected_tag.url);
  assertEquals(actual.type, expected_tag.type);
  assertEquals(actual.description, expected_tag.description);
  assertEquals(actual.modifiers.sort.name, expected_mod.name);
  assertEquals(actual.modifiers.sort.value, expected_mod.value);
  assertEquals(actual.modifiers.sort.description, expected_mod.description);
  assertEquals(actual.modifiers.sort.type, expected_mod.type);
});
/**
 * --------------------------------
 * makeModifierItems()
 * --------------------------------
 */
Deno.test("makeModifierItems_ok", async () => {
  // prepare
  const expected_modifier = test_data.expected_modifier;
  const cms = new movabletype();

  // execute
  const actual = await cms.makeModifierItems();

  // assert
  assertEquals(actual.capitalize.name, expected_modifier.name);
});
