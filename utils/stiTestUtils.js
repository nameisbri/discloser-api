// stiTestUtils.js

export const STI_TESTS = [
  {
    name: "Chlamydia",
    regex: /CHLAMYDIA\s+TRACHOMATIS\s+([A-Z]+)/i,
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Specimen",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
      {
        pattern: /TIME OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Time",
      },
    ],
  },
  {
    name: "Gonorrhea",
    regex: /NEISSERIA\s+GONORRHOEAE\s+([A-Z]+)/i,
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Specimen",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
      {
        pattern: /TIME OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Time",
      },
    ],
  },
  {
    name: "Trichomonas",
    regex: /TRICHOMONAS\s+VAGINALIS\s+([A-Z]+)/i,
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Specimen",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
      {
        pattern: /TIME OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Time",
      },
    ],
  },
];

// Helper function to standardize result values
export const standardizeResult = (result) => {
  const positivePatterns = /positive|reactive|detected|present/i;
  const negativePatterns = /negative|non-reactive|not detected|absent/i;

  if (positivePatterns.test(result)) {
    return "Positive";
  } else if (negativePatterns.test(result)) {
    return "Negative";
  } else {
    return "Indeterminate";
  }
};

// Function to extract test notes
const extractTestNotes = (text, testConfig) => {
  const notes = [];

  testConfig.notePatterns.forEach(({ pattern, label }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = match[1].trim().replace(/\s+/g, " ");
      if (value && value !== "") {
        notes.push(`${label}: ${value}`);
      }
    }
  });

  // Add any warning messages about sample volume
  const volumeWarning = text.match(/Please note that the volume[^.]+\./);
  if (volumeWarning) {
    notes.push(`Lab Note: ${volumeWarning[0].trim()}`);
  }

  return notes.join(" | ");
};

// Enhanced function to find STI test results in extracted text
export const findTestResults = (text, pageNum) => {
  const results = [];
  const textBlock = typeof text === "string" ? text : text.toString();

  STI_TESTS.forEach((test) => {
    const match = textBlock.match(test.regex);

    if (match && match[1]) {
      const result = standardizeResult(match[1]);

      // Get the context around this test result for notes
      const contextStart = Math.max(0, match.index - 500);
      const contextEnd = Math.min(textBlock.length, match.index + 500);
      const context = textBlock.slice(contextStart, contextEnd);

      // Extract notes from the context
      const notes = extractTestNotes(context, test);

      results.push({
        test_type: test.name,
        result: result,
        notes: notes || "N/A", // Fallback to page number if no specific notes found
      });
    }
  });

  return results;
};
