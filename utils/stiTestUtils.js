// utils/stiTestUtils.js

// List of STI tests and their regex patterns
export const STI_TESTS = [
  { name: "Chlamydia", regex: /Chlamydia\s*Trachomatis/i },
  { name: "Gonorrhea", regex: /Neisseria\s*Gonorrhoeae/i },
  { name: "Trichomonas", regex: /Trichomonas\s*Vaginalis/i },
  { name: "HIV", regex: /HIV/i },
  { name: "Syphilis", regex: /Syphilis/i },
  { name: "Hepatitis B", regex: /Hepatitis\s*B/i },
  { name: "Hepatitis C", regex: /Hepatitis\s*C/i },
  { name: "Herpes", regex: /Herpes/i },
];

// Function to find STI test results in extracted text
export const findTestResults = (text) => {
  const results = [];

  STI_TESTS.forEach((test) => {
    // Search for the test name in the text
    const testMatch = text.match(test.regex);

    if (testMatch) {
      // Extract the result (e.g., "Negative", "Positive", "Reactive", "Non-reactive")
      const resultRegex = /(Negative|Positive|Reactive|Non-reactive)/i;
      const resultMatch = text.slice(testMatch.index).match(resultRegex);

      results.push({
        test_type: test.name,
        result: resultMatch ? resultMatch[0] : "Unknown", // Default to "Unknown" if no result is found
      });
    }
  });

  return results;
};
