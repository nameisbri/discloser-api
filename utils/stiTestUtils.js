export const TEST_RESULTS = {
  POSITIVE: "Positive",
  NEGATIVE: "Negative",
  IMMUNE: "Immune",
  NOT_IMMUNE: "Not Immune",
  DETECTED: "Detected",
  NOT_DETECTED: "Not Detected",
  INDETERMINATE: "Indeterminate",
  NUMERIC: "Numeric",
};

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

export const findTestResults = (text) => {
  console.log("\n--- Test Result Search Debug ---");
  console.log("Full extracted text:", text);
  console.log("\nSearching for patterns...");

  const results = [];
  const textBlock = typeof text === "string" ? text : text.toString();

  STI_TESTS.forEach((test) => {
    try {
      console.log(`\nChecking for test: ${test.name}`);
      console.log("Using regex:", test.regex);

      const match = textBlock.match(test.regex);

      if (match) {
        console.log("Found match:", match);
        console.log("Match groups:", match.groups);
        console.log("Match index:", match.index);

        const rawResult = match[1].trim();
        console.log("Raw result:", rawResult);

        const { result, value } = standardizeResult(rawResult, test.name);
        console.log("Standardized result:", { result, value });

        // Get context around the match for better note extraction
        const contextStart = Math.max(0, match.index - 500);
        const contextEnd = Math.min(textBlock.length, match.index + 500);
        const context = textBlock.slice(contextStart, contextEnd);
        console.log("Context around match:", context);

        const notes = extractTestNotes(context, test, rawResult, value);
        console.log("Extracted notes:", notes);

        results.push({
          test_type: test.name,
          result: result,
          notes: notes || "No additional notes",
        });
      } else {
        console.log("No match found for this test");
      }
    } catch (error) {
      console.error(`Error processing test ${test.name}:`, error);
    }
  });

  console.log(`\nTotal results found: ${results.length}`);
  if (results.length > 0) {
    console.log("Results:", results);
  }

  return results;
};

// Helper function to dump the current patterns we're looking for
export const dumpTestPatterns = () => {
  console.log("\n--- Current Test Patterns ---");
  STI_TESTS.forEach((test) => {
    console.log(`\nTest: ${test.name}`);
    console.log("Regex:", test.regex);
    console.log("Note patterns:", test.notePatterns);
  });
};
