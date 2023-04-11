import { asserts } from "./testDeps.ts";
import * as utils from "../libs/utils.ts";
import { deno_dom } from "../libs/deps.ts";

/**
 * --------------------------------
 * fetchDocument()
 * - fetch errorの再現はできない
 * - parse errorの再現はできない
 * --------------------------------
 */
Deno.test("fetchDocument_ok", async () => {
  // prepare.
  const url = "https://example.com";
  const selector = "h1";
  const expected = "Example Domain";

  // execute.
  const document = await utils.fetchDocument(url);

  // assert.
  asserts.assertEquals(document.querySelector(selector)?.textContent, expected);
});

Deno.test("fetchDocument_ng_invalid_url", async () => {
  // prepare.
  const url = "";
  const expected = utils.ERROR_MESSAGES.url;
  try {
    // execute.
    await utils.fetchDocument(url);
  } catch (e) {
    // assert.
    asserts.assertEquals(e.message, expected);
  }
});

/**
 * --------------------------------
 * fetchElement()
 * - fetch errorの再現はできない
 * - parse errorの再現はできない
 * --------------------------------
 */
Deno.test("fetchElement_ok", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "h1";
  const expected = "Example Domain";

  // execute
  const element = await utils.fetchElement(url, selector);

  // assert
  asserts.assertEquals(element?.textContent, expected);
});

Deno.test("fetchElement_ng_invalid_selector", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "";
  const expected = utils.ERROR_MESSAGES.selector;

  try {
    // execute
    await utils.fetchElement(url, selector);
  } catch (actual_error) {
    // assert
    asserts.assertEquals(actual_error.message, expected);
  }
});

Deno.test("fetchElement_ng_nullSelector", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "article";
  const expected = utils.ERROR_MESSAGES.nullSelector;

  try {
    // execute
    await utils.fetchElement(url, selector);
  } catch (actual_error) {
    // assert
    asserts.assertEquals(actual_error.message, expected);
  }
});

/**
 * --------------------------------
 * normalizeTagName()
 * --------------------------------
 */
Deno.test("normalizeTagName_ok", () => {
  // assert
  // none
  asserts.assertEquals(utils.normalizeTagName("MTActions"), "MTActions");
  // head space
  asserts.assertEquals(utils.normalizeTagName("  MTActions"), "MTActions");
  // end space
  asserts.assertEquals(utils.normalizeTagName("MTActions  "), "MTActions");
  // colon
  asserts.assertEquals(utils.normalizeTagName("MT:Actions"), "MTActions");
  // mt app tag
  asserts.assertEquals(
    utils.normalizeTagName("MTAppActionBar"),
    "MTAppActionBar",
  );
  // dollar
  asserts.assertEquals(
    utils.normalizeTagName("$MTAppActionBar$"),
    "MTAppActionBar",
  );
  // powercmsX
  asserts.assertEquals(
    utils.normalizeTagName("<mt:activitymonths> ~ </mt:activitymonths>"),
    "mtactivitymonths",
  ); // powercmsX
  asserts.assertEquals(
    utils.normalizeTagName("\n<mt:accesstracking />"),
    "mtaccesstracking",
  );
  try {
    utils.normalizeTagName("");
  } catch (error) {
    asserts.assertEquals(error.message, "" + utils.ERROR_MESSAGES.notTagName);
  }
});

/**
 * --------------------------------
 * discriminateType()
 * --------------------------------
 */
Deno.test("discriminateType_ok", () => {
  asserts.assertEquals(utils.discriminateType("block"), "block");
  asserts.assertEquals(utils.discriminateType("Block"), "block");
  asserts.assertEquals(utils.discriminateType("BLOCK"), "block");
  asserts.assertEquals(utils.discriminateType("function"), "function");
  asserts.assertEquals(utils.discriminateType("Function"), "function");
  asserts.assertEquals(utils.discriminateType("FUNCTION"), "function");
  asserts.assertEquals(utils.discriminateType("hoge"), "undefined");
});
/**
 * --------------------------------
 * descriptionEscapeHTML()
 * --------------------------------
 */
Deno.test("descriptionEscapeHTML_ok", () => {
  // prepare
  const expected = "これは\ntest test\nの\n何か";
  const html = [
    "<!DOCTYPE html><html><head></head><body>",
    "<p>これは</p>",
    "<p>test 　  test</p>",
    "<p>の</p>",
    "<p> </p>",
    "<p>   </p>",
    "<p></p>",
    "<p>  何か   </p>",
    "</body></html>",
  ].join("");
  const document = new deno_dom.DOMParser().parseFromString(html, "text/html");
  const nodeList = document?.querySelectorAll("p");
  if (!nodeList) {
    asserts.assertEquals(true, false);
    return;
  }

  // execute
  const actual = utils.descriptionEscapeHTML(nodeList);

  // assert
  asserts.assertEquals(actual, expected);
});

/**
 * --------------------------------
 * divideIntoHundredPieces()
 * --------------------------------
 */
Deno.test("divideIntoHundredPieces_ok", () => {
  // prepare
  const nameAndURL: utils.TNameAndURL[] = new Array(189);

  // execute
  const actual = utils.divideIntoHundredPieces(nameAndURL);

  // assert
  asserts.assertEquals(actual.length, 2);
  asserts.assertEquals(actual[0].length, 100);
  asserts.assertEquals(actual[1].length, 89);
});
