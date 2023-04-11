import { asserts } from "./testDeps.ts";
import powercms from "../libs/powercms.ts";
import { powercms_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";
import { TGlobalModifiers } from "../libs/item.ts";

Deno.test("makeTagItem_ok_Assets", async () => {
  // prepare
  const expected = powercms_testData.expected_tag2;
  const expected_mod1 = expected.modifiers.lastn;
  const expected_mod2 = expected.modifiers.assets_per_row;
  const url = expected.url;
  const name = expected.name;
  const cms = new powercms();

  // execute
  const actual = await cms.makeTagItem(url, name);

  // assert prepare
  const actual_mod1 = actual.modifiers["lastn"];
  const actual_mod2 = actual.modifiers["assets_per_row"];

  // assert
  // tag
  asserts.assertEquals(actual.name, expected.name);
  asserts.assertEquals(actual.type, expected.type);
  asserts.assertEquals(actual.url, expected.url);
  asserts.assertEquals(actual.description, expected.description);

  // modifier
  asserts.assertEquals(actual_mod1.name, expected_mod1.name);
  asserts.assertEquals(actual_mod1.value, expected_mod1.value);
  asserts.assertEquals(actual_mod1.description, expected_mod1.description);
  asserts.assertEquals(actual_mod1.type, expected_mod1.type);

  asserts.assertEquals(actual_mod2.name, expected_mod2.name);
  asserts.assertEquals(actual_mod2.value, expected_mod2.value);
  asserts.assertEquals(actual_mod2.description, expected_mod2.description);
  asserts.assertEquals(actual_mod2.type, expected_mod2.type);
});

Deno.test("makeLocalModifiers_ok_Assets", async () => {
  // prepare
  const expected_tag = powercms_testData.expected_tag2;
  const expected_mod1 = expected_tag.modifiers.lastn;
  const expected_mod2 = expected_tag.modifiers.assets_per_row;
  const cms = new powercms();
  const contents = await utils.fetchElement(
    expected_tag.url,
    cms.TAG_DETAIL_SELECTOR,
  );
  if (!contents) {
    asserts.fail("fetch error");
  }

  // execute
  const _actual = cms.makeLocalModifiers(contents);
  console.log(_actual);

  // assert prepare
  const actual_mod1 = _actual["lastn"];
  const actual_mod2 = _actual["assets_per_row"];

  // assert
  asserts.assertEquals(actual_mod1.name, expected_mod1.name);
  asserts.assertEquals(actual_mod1.value, expected_mod1.value);
  asserts.assertEquals(actual_mod1.description, expected_mod1.description);
  asserts.assertEquals(actual_mod1.type, expected_mod1.type);

  asserts.assertEquals(actual_mod2.name, expected_mod2.name);
  asserts.assertEquals(actual_mod2.value, expected_mod2.value);
  asserts.assertEquals(actual_mod2.description, expected_mod2.description);
  asserts.assertEquals(actual_mod2.type, expected_mod2.type);
});

Deno.test("makeTagArr", async () => {
  // prepare
  const cms = new powercms();

  // execute
  const _actual = await cms.makeTagArr();

  // assert
  let c = 0;
  _actual.map((tag) => {
    console.log(`${c}.assert ` + tag.name);
    asserts.assertNotEquals(tag.description, utils.dummyTag.description);
    c++;
  });
});

Deno.test("makeGlobalModifierArr_ng", async () => {
  // prepare
  const expected_mod1 = powercms_testData.expected_mod1;
  const expected_mod2 = powercms_testData.expected_mod2;
  const cms = new powercms();

  // execute
  const _actual = await cms.makeGlobalModifierArr();

  // assert prepare
  const actual: TGlobalModifiers = {};
  _actual.forEach((item) => {
    actual[item.name.toLowerCase()] = item;
  });
  const actual_mod1 = actual["absolute"];
  const actual_mod2 = actual["zero_pad"];

  // assert
  asserts.assertEquals(actual_mod1.name, expected_mod1.name);
  asserts.assertEquals(actual_mod1.type, expected_mod1.type);
  asserts.assertEquals(actual_mod1.description, expected_mod1.description);
  asserts.assertEquals(actual_mod1.url, expected_mod1.url);

  asserts.assertEquals(actual_mod2.name, expected_mod2.name);
  asserts.assertEquals(actual_mod2.type, expected_mod2.type);
  asserts.assertEquals(actual_mod2.description, expected_mod2.description);
  asserts.assertEquals(actual_mod2.url, expected_mod2.url);
});
