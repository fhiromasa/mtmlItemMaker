import { asserts } from "./testDeps.ts";
import movabletype_net from "../libs/movabletype_net.ts";
import { movabletype_net_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";
import { TGlobalModifiers, TTags } from "../libs/item.ts";

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
  const expected_tag = movabletype_net_testData.expected_lmod1;
  const expected_mod1 = expected_tag.modifiers["var"];
  const expected_mod2 = expected_tag.modifiers["variable_foo"];
  const url = expected_tag.url;
  const cms = new movabletype_net();
  const element = await utils.fetchElement(url, cms.TAG_DETAIL_SELECTOR);

  // execute
  const actual = cms.makeLocalModifiers(element);
  const actual_mod1 = actual["var"];
  const actual_mod2 = actual["variable_foo"];

  // console.log(JSON.stringify(actual));

  // assert
  asserts.assertEquals(actual_mod1.name, expected_mod1.name);
  asserts.assertEquals(actual_mod1.value, expected_mod1.value);
  asserts.assertEquals(
    actual_mod1.description,
    expected_mod1.description,
  );

  asserts.assertEquals(actual_mod2.name, expected_mod2.name);
  asserts.assertEquals(actual_mod2.value, expected_mod2.value);
  asserts.assertEquals(
    actual_mod2.description,
    expected_mod2.description,
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
