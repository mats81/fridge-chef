// Run with: npm test
//
// The diet heuristics decide which recipes survive a dietary filter, so a wrong
// tag is not cosmetic — it can put meat in front of someone filtering for vegan.
// These cases pin down the traps found while building it: German compounds,
// plant-based products named after dairy, and words that merely look like others.

import assert from "node:assert/strict";
import { test } from "node:test";
import { deriveDietTags } from "../lib/diet.ts";

type Case = {
  title: string;
  ingredients: string[];
  expect?: string[];
  reject?: string[];
};

const cases: Case[] = [
  {
    title: "Thai-Curry mit Kokosmilch",
    ingredients: ["Kokosmilch", "Tofu", "Brokkoli", "Reis"],
    // "Kokosmilch" contains "milch" but is not dairy
    expect: ["vegan", "vegetarian", "lactose-free", "gluten-free"]
  },
  {
    title: "Weizenbrot mit Butter",
    ingredients: ["Weizenmehl", "Butter", "Hefe"],
    expect: ["vegetarian"],
    reject: ["vegan", "gluten-free", "lactose-free"]
  },
  {
    title: "Rührei mit Speck",
    ingredients: ["Eiern", "Speck", "Pfeffer"],
    reject: ["vegan", "vegetarian"]
  },
  {
    title: "Tomaten-Reis-Quiche",
    ingredients: ["Tomaten", "Reis", "Eier"],
    // The title reveals the pastry the ingredient list omits
    expect: ["vegetarian"],
    reject: ["gluten-free", "vegan"]
  },
  {
    title: "Erdnussbutter-Smoothie",
    ingredients: ["Erdnussbutter", "Hafermilch", "Banane"],
    expect: ["vegan", "lactose-free"]
  },
  {
    title: "Risotto mit Weisswein",
    ingredients: ["Reis", "Weisswein", "Zwiebeln", "Olivenoel"],
    // "Weisswein" contains "ei" — must not read as egg
    expect: ["vegan", "vegetarian", "gluten-free"]
  },
  {
    title: "Kalbsgeschnetzeltes",
    ingredients: ["Kalbfleisch", "Rahm", "Zwiebeln"],
    reject: ["vegetarian", "vegan", "lactose-free"]
  },
  {
    title: "Kaesespaetzle",
    ingredients: ["Spaetzle", "Bergkaese", "Roestzwiebeln"],
    expect: ["vegetarian"],
    reject: ["vegan", "gluten-free", "lactose-free"]
  },
  {
    title: "Magerquark mit Beeren",
    ingredients: ["Magerquark", "Heidelbeeren", "Honig"],
    // "Heidelbeeren" must not match the gluten term for beer
    expect: ["vegetarian", "gluten-free"],
    reject: ["vegan", "lactose-free"]
  },
  {
    title: "Risotto mit Gemuesebruehe",
    ingredients: ["Reis", "Gemuesebruehe", "Zwiebeln"],
    expect: ["vegetarian", "vegan"]
  },
  {
    title: "Suppe mit Huehnerbruehe",
    ingredients: ["Huehnerbruehe", "Karotten", "Nudeln"],
    reject: ["vegetarian", "vegan", "gluten-free"]
  },
  {
    title: "Lachsfilet auf Spinat",
    ingredients: ["Lachs", "Spinat", "Zitrone"],
    expect: ["gluten-free"],
    reject: ["vegetarian", "vegan"]
  }
];

for (const testCase of cases) {
  test(testCase.title, () => {
    const tags = deriveDietTags({
      title: testCase.title,
      ingredients: testCase.ingredients.map((name) => ({ name })),
      timeMinutes: 30
    });

    for (const tag of testCase.expect ?? []) {
      assert.ok(tags.includes(tag as never), `fehlender Tag "${tag}" — erhalten: ${tags.join(", ")}`);
    }

    for (const tag of testCase.reject ?? []) {
      assert.ok(
        !tags.includes(tag as never),
        `faelschlicher Tag "${tag}" — erhalten: ${tags.join(", ")}`
      );
    }
  });
}
