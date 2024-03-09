const crypto = require("crypto");

/**
 * Calculates SHA-256 hash.
 *
 * @param {string} text - the text.
 * @returns {string} - Returns sha-256 hash text.
 */
function calculateSHA256(text) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
}

/**
 * Compares two SHA-256 hashes.
 *
 * @param {string} hash1 - The first hash.
 * @param {string} hash2 - The second hash.
 * @returns {boolean} - Returns true if the hashes match, false otherwise.
 */
function compareHashes(hash1, hash2) {
  return hash1 === hash2;
}

module.exports = {
  compareHashes,
  calculateSHA256,
};
