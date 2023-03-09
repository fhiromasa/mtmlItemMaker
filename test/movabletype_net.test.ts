import { asserts } from "./testDeps.ts";
import movabletype_net from "../libs/movabletype_net.ts";
import { movabletype_net_testData } from "./testData.ts";
import * as utils from "../libs/utils.ts";
import { deno_dom } from "../libs/deps.ts";

/**
 * --------------------------------
 * property check
 * modifierは実装する時にコメントアウトを外す
 * --------------------------------
 */
Deno.test("property", () => {
  const cms = new movabletype_net();
  asserts.assertNotEquals(cms.TAG_URL, "");
  asserts.assertNotEquals(cms.TAG_SELECTOR, "");
  asserts.assertNotEquals(cms.TAG_DETAIL_SELECTOR, "");
  // asserts.assertNotEquals(cms.MODIFIER_URL, "");
  // asserts.assertNotEquals(cms.MODIFIER_SELECTOR, "");
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

Deno.test("makeTagModifiers", () => {
  // prepare
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync("./test/html/mtsitesearchsnippet.html");
  const html = decoder.decode(data);

  const document = new deno_dom.DOMParser().parseFromString(
    html,
    "text/html",
  );
  if (!document) {
    throw new asserts.AssertionError("document is null");
  }
  const cms = new movabletype_net();

  // execute
  const actual = cms.makeTagModifiers(document);

  // assert
  asserts.assertEquals(actual.fields.name, "fields");
  asserts.assertEquals(actual.user_dictionary.description, "fields");
});
