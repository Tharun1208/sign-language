// Alphabet reference used by the Sign Dictionary.
// Vocabulary is intentionally marked unverified until an ISL
// expert reviews the reference material.

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const DICTIONARY_CATEGORIES = ["All", "Alphabet"];

export const SIGN_DICTIONARY = LETTERS.map((letter) => ({
  id: letter,
  label: letter,
  category: "Alphabet",
  language: "ISL",
  verified: false,
  description: `Finger-spelled letter ${letter}.`,
  tip: `Open Live detection, hold the sign for ${letter} steady, and add it to a sentence.`,
}));

export const findDictionaryEntry = (label) =>
  SIGN_DICTIONARY.find((entry) => entry.label === String(label).toUpperCase());
