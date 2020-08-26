const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const FIRST_APPEARENCE_SELECTOR =
  "div.entity.entity-field-collection-item.field-collection-item-field-first-appearance.clearfix > div > div.field.field-name-field-first-appearance-text.field-type-text.field-label-hidden > div > div";

const CUSTOM_INFO_VALUE =
  "div.entity.entity-field-collection-item.field-collection-item-field-custom-information.clearfix > div > div.field.field-name-field-value.field-type-text-long.field-label-hidden > div > div > p";

const CUSTOM_INFO_LABEL =
  "div > div.field.field-name-field-label.field-type-text.field-label-hidden > div > div";

const CUSTOM_INFO_CONTAINER =
  ".entity.entity-field-collection-item.field-collection-item-field-custom-information.clearfix";

const BASE_OF_OP_SELECTOR =
  "div.views-field.views-field-field-char-base-of-operations > div";

async function getCharacterPage(characterUrl = "/characters/superman") {
  const result = await axios.get(`${process.env.DC_BASE_URL}${characterUrl}`);
  return result.data;
}

function getAdditionalInfo($) {
  let customInfo = [];
  $(CUSTOM_INFO_VALUE).each((index, el) => {
    const value = $(el).text();
    const container = $(el).closest(CUSTOM_INFO_CONTAINER);
    const label = container.find(CUSTOM_INFO_LABEL).text();
    customInfo.push(`${label}: ${value}`);
  });

  const baseOfOp = $(BASE_OF_OP_SELECTOR);
  if (baseOfOp.length === 1) {
    customInfo.push(`Base of Operations: ${baseOfOp.text()}`);
  }
  return customInfo;
}

function getPowers($) {
  const powers = $(
    ".views-field.views-field-field-character-powers > .field-content"
  ).html();
  if (powers !== null) {
    return powers;
  }
  // search link powers
  const linkPowers = $(
    ".views-field.views-field-field-char-powers > .field-content"
  );
  return linkPowers.text();
}
async function getCharacterFacts(characterUrl) {
  const html = await getCharacterPage(characterUrl);
  const $ = cheerio.load(html);
  const powers = getPowers($);
  const alterEgo = $(
    ".views-field.views-field-field-character-alias-alter-ego > .field-content"
  ).html();
  const firstAppearenceTag = $(FIRST_APPEARENCE_SELECTOR);
  const additionalInfo = getAdditionalInfo($);
  return {
    powers,
    alterEgo,
    additionalInfo,
    firstAppearence: {
      url: firstAppearenceTag.children("a").attr("href"),
      title: firstAppearenceTag.text(),
    },
  };
}

async function run() {
  const facts = await getCharacterFacts("/characters/superman");
  console.log({ facts });
}

module.exports = {
  getCharacterFacts,
};
