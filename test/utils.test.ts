import { assertEquals } from "./testDeps.ts";
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
  assertEquals(document.querySelector(selector)?.textContent, expected);
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
    assertEquals(e.message, expected);
  }
});

/**
 * --------------------------------
 * elementFromURL()
 * - fetch errorの再現はできない
 * - parse errorの再現はできない
 * --------------------------------
 */
Deno.test("elementFromURL_ok", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "h1";
  const expected = "Example Domain";

  // execute
  const element = await utils.elementFromURL(url, selector);

  // assert
  assertEquals(element?.textContent, expected);
});

Deno.test("elementFromURL_ng_invalid_selector", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "";
  const expected = utils.ERROR_MESSAGES.selector;

  try {
    // execute
    await utils.elementFromURL(url, selector);
  } catch (actual_error) {
    // assert
    assertEquals(actual_error.message, expected);
  }
});

Deno.test("elementFromURL_ng_nullSelector", async () => {
  // prepare
  const url = "https://example.com";
  const selector = "article";
  const expected = utils.ERROR_MESSAGES.nullSelector;

  try {
    // execute
    await utils.elementFromURL(url, selector);
  } catch (actual_error) {
    // assert
    assertEquals(actual_error.message, expected);
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
  assertEquals(utils.normalizeTagName("MTActions"), "MTActions");
  // head space
  assertEquals(utils.normalizeTagName("  MTActions"), "MTActions");
  // end space
  assertEquals(utils.normalizeTagName("MTActions  "), "MTActions");
  // colon
  assertEquals(utils.normalizeTagName("MT:Actions"), "MTActions");
  // mt app tag
  assertEquals(utils.normalizeTagName("MTAppActionBar"), "MTAppActionBar");
  // dollar
  assertEquals(utils.normalizeTagName("$MTAppActionBar$"), "MTAppActionBar");
  // powercmsX
  assertEquals(
    utils.normalizeTagName("<mt:activitymonths> ~ </mt:activitymonths>"),
    "mtactivitymonths",
  ); // powercmsX
  assertEquals(
    utils.normalizeTagName("\n<mt:accesstracking />"),
    "mtaccesstracking",
  );
  try {
    utils.normalizeTagName("");
  } catch (error) {
    assertEquals(error.message, "" + utils.ERROR_MESSAGES.notTagName);
  }
});

/**
 * --------------------------------
 * discriminateType()
 * --------------------------------
 */
Deno.test("discriminateType_ok", () => {
  assertEquals(utils.discriminateType("block"), "block");
  assertEquals(utils.discriminateType("Block"), "block");
  assertEquals(utils.discriminateType("BLOCK"), "block");
  assertEquals(utils.discriminateType("function"), "function");
  assertEquals(utils.discriminateType("Function"), "function");
  assertEquals(utils.discriminateType("FUNCTION"), "function");
  assertEquals(utils.discriminateType("hoge"), "undefined");
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
    assertEquals(true, false);
    return;
  }

  // execute
  const actual = utils.descriptionEscapeHTML(nodeList);

  // assert
  assertEquals(actual, expected);
});
