import { TGlobalModifiers, TTags } from "../item.ts";
import powercms_x from "../libs/powercms_x.ts";
import { powercms_x_testData } from "./testData.ts";
import { asserts } from "./testDeps.ts";

Deno.test("makeGlobalModifierArr", async () => {
  // prepare
  const cms = new powercms_x();
  const expected1 = powercms_x_testData.expected_gmod1;
  const expected2 = powercms_x_testData.expected_gmod2;

  // execute
  const actual = await cms.makeGlobalModifierArr();
  console.log(actual);

  const actual_obj: TGlobalModifiers = {};
  actual.forEach((item) => {
    actual_obj[item.name.toLowerCase()] = item;
  });
  const actual1 = actual_obj[expected1.name];
  const actual2 = actual_obj[expected2.name];

  // assert
  asserts.assertEquals(actual1.name, expected1.name);
  asserts.assertEquals(actual1.description, expected1.description);
  asserts.assertEquals(actual1.url, expected1.url);

  asserts.assertEquals(actual2.name, expected2.name);
  asserts.assertEquals(actual2.description, expected2.description);
  asserts.assertEquals(actual2.url, expected2.url);
});

Deno.test("makeTagArr", async () => {
  // prepare
  const cms = new powercms_x();
  const expected_btag1 = powercms_x_testData.expected_btag1;
  const expected_btag2 = powercms_x_testData.expected_btag2;
  const expected_ctag1 = powercms_x_testData.expected_ctag1;
  const expected_ctag2 = powercms_x_testData.expected_ctag2;
  const expected_ftag1 = powercms_x_testData.expected_ftag1;
  const expected_ftag2 = powercms_x_testData.expected_ftag2;

  const expected_lmod1 = powercms_x_testData.expected_lmod1;
  const expected_lmod2 = powercms_x_testData.expected_lmod2;

  // execute
  const actual = await cms.makeTagArr();

  const actual_obj: TTags = {};
  actual.forEach((item) => {
    actual_obj[item.name.toLowerCase()] = item;
  });
  const actual_btag1 = actual_obj[expected_btag1.name];
  const actual_btag2 = actual_obj[expected_btag2.name];
  const actual_ctag1 = actual_obj[expected_ctag1.name];
  const actual_ctag2 = actual_obj[expected_ctag2.name];
  const actual_ftag1 = actual_obj[expected_ftag1.name];
  const actual_ftag2 = actual_obj[expected_ftag2.name];

  const actual_lmod1 = actual_obj["mtassets"].modifiers[expected_lmod1.name];
  const actual_lmod2 = actual_obj["mtassets"].modifiers[expected_lmod2.name];

  // assert
  asserts.assertEquals(actual_btag1.name, expected_btag1.name);
  asserts.assertEquals(actual_btag1.description, expected_btag1.description);
  asserts.assertEquals(actual_btag1.type, expected_btag1.type);
  asserts.assertEquals(actual_btag1.url, expected_btag1.url);

  asserts.assertEquals(actual_btag2.name, expected_btag2.name);
  asserts.assertEquals(actual_btag2.description, expected_btag2.description);
  asserts.assertEquals(actual_btag2.type, expected_btag2.type);
  asserts.assertEquals(actual_btag2.url, expected_btag2.url);

  asserts.assertEquals(actual_ctag1.name, expected_ctag1.name);
  asserts.assertEquals(actual_ctag1.description, expected_ctag1.description);
  asserts.assertEquals(actual_ctag1.type, expected_ctag1.type);
  asserts.assertEquals(actual_ctag1.url, expected_ctag1.url);

  asserts.assertEquals(actual_ctag2.name, expected_ctag2.name);
  asserts.assertEquals(actual_ctag2.description, expected_ctag2.description);
  asserts.assertEquals(actual_ctag2.type, expected_ctag2.type);
  asserts.assertEquals(actual_ctag2.url, expected_ctag2.url);

  asserts.assertEquals(actual_ftag1.name, expected_ftag1.name);
  asserts.assertEquals(actual_ftag1.description, expected_ftag1.description);
  asserts.assertEquals(actual_ftag1.type, expected_ftag1.type);
  asserts.assertEquals(actual_ftag1.url, expected_ftag1.url);

  asserts.assertEquals(actual_ftag2.name, expected_ftag2.name);
  asserts.assertEquals(actual_ftag2.description, expected_ftag2.description);
  asserts.assertEquals(actual_ftag2.type, expected_ftag2.type);
  asserts.assertEquals(actual_ftag2.url, expected_ftag2.url);

  asserts.assertEquals(actual_lmod1.name, expected_lmod1.name);
  asserts.assertEquals(actual_lmod1.description, expected_lmod1.description);
  asserts.assertEquals(actual_lmod1.type, expected_lmod1.type);
  asserts.assertEquals(actual_lmod1.value, expected_lmod1.value);

  asserts.assertEquals(actual_lmod2.name, expected_lmod2.name);
  asserts.assertEquals(actual_lmod2.description, expected_lmod2.description);
  asserts.assertEquals(actual_lmod2.type, expected_lmod2.type);
  asserts.assertEquals(actual_lmod2.value, expected_lmod2.value);
});
