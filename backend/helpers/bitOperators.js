function getNthBit(number, n) {
  // Right shift the number to bring the desired bit to the rightmost position
  // Then perform a bitwise AND with 1 to get the value of that bit
  return (number >> n) & 1;
}
// // Example usage
// let myNumber = 42; // Binary representation: 101010
// let nthBitValue = getNthBit(myNumber, 2); // Get the value of the 2nd bit (from the right)
// console.log(nthBitValue); // Output: 1

function getBitsInRange(number, n, m) {
  // Create a bitmask to extract the desired bits
  let bitmask = ((1 << (m - n + 1)) - 1) << n;

  // Use the bitmask to extract the bits
  let result = (number & bitmask) >> n;

  return result;
}
// // Example usage
// let myNumber = 170; // Binary representation: 10101010
// let result = getBitsInRange(myNumber, 3, 6); // Get bits 3 to 6 (from the right)
// console.log(result); // Output: 5 (binary representation: 0101)

function setNthBit(number, n, bitValue) {
  // bitValue should be 0 or 1
  // If bitValue is 1, we set the nth bit to 1
  // If bitValue is 0, we clear the nth bit
  if (bitValue === 1) {
    // Set the nth bit to 1
    return number | (1 << (n - 1)); // Subtract 1 because bit positions start at 0
  } else if (bitValue === 0) {
    // Clear the nth bit
    return number & ~(1 << (n - 1)); // Subtract 1 because bit positions start at 0
  } else {
    throw new Error("bitValue must be 0 or 1");
  }
}

// // Example usage
// let myNumber = 5; // Binary representation: 0101
// let result = setNthBit(myNumber, 2); // Set the 2nd bit
// console.log(result); // Output: 7 (binary representation: 0111)

function setBitsInRange(number, n, m, value) {
  // Create a bitmask to clear the bits in the range
  let clearMask = ~(((1 << (m - n + 1)) - 1) << n);

  // Clear the bits in the range
  let clearedNumber = number & clearMask;

  // Set the bits to the desired value
  let result = clearedNumber | ((value << n) & ~clearMask);

  return result;
}

// // Example usage
// let myNumber = 170; // Binary representation: 10101010
// let newValue = 6;   // Binary representation: 0110
// let result = setBitsInRange(myNumber, 3, 6, newValue); // Set bits 3 to 6
// console.log(result); // Output: 182 (binary representation: 10110110)
module.exports = {
  setNthBit,
  getNthBit,
};
