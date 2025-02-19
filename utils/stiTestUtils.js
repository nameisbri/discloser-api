export const TEST_RESULTS = {
  POSITIVE: "Positive",
  NEGATIVE: "Negative",
  IMMUNE: "Immune",
  NOT_IMMUNE: "Not Immune",
  DETECTED: "Detected",
  NOT_DETECTED: "Not Detected",
  INDETERMINATE: "Indeterminate",
  NUMERIC: "Numeric",
  REACTIVE: "Reactive",
  NON_REACTIVE: "Non-Reactive",
};

export const STI_TESTS = [
  // LifeLabs Format Tests
  {
    name: "Chlamydia trachomatis",
    regex: /CHLAMYDIA\s+TRACHOMATIS\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
      {
        pattern: /TIME OF COLLECTION\s+([0-9:]+)/i,
        label: "Collection Time",
      },
    ],
  },
  {
    name: "Neisseria gonorrhoeae",
    regex: /NEISSERIA\s+GONORRHOEAE\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
      {
        pattern: /TIME OF COLLECTION\s+([0-9:]+)/i,
        label: "Collection Time",
      },
    ],
  },
  {
    name: "Trichomonas vaginalis",
    regex: /TRICHOMONAS\s+VAGINALIS\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /SOURCE:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /DATE OF COLLECTION\s+([^\n]+)/i,
        label: "Collection Date",
      },
    ],
  },

  // Public Health Lab Format Tests
  // Hepatitis A Tests
  {
    name: "Hepatitis A IgG Antibody",
    regex: /Hepatitis\s+A\s+IgG\s+Antibody\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /Date Collected:\s*([^\n]+)/i,
        label: "Collection Date",
      },
    ],
  },
  {
    name: "Hepatitis A Virus Interpretation",
    regex: /Hepatitis\s+A\s+Virus\s+[Ii]nterpretation\s+([^\n]+)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },

  {
    name: "Hepatitis B Surface Antigen",
    regex:
      /Hepatitis\s+B\s+Surface\s+Antigen\s+(Non-Reactive[^\n]*|\d+\s*[a-zA-Z/]+)/i,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Hepatitis B Core Total Antibody",
    regex:
      /Hepatitis\s+B\s+Core\s+Total\s+\(IgG\+IgM\)\s+Antibody\s+(Non-Reactive[^\n]*|\d+\s*[a-zA-Z/]+)/i,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Hepatitis B Virus Interpretation",
    regex:
      /Hepatitis\s+B\s+Virus\s+[Ii]nterpretation\s+(No evidence of Hepatitis B Virus infection[^\n]*)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Hepatitis B Surface Antibody",
    regex: /Hepatitis\s+B\s+Surface\s+Antibody\s+([0-9.]+\s*[a-zA-Z/]+)/i,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Hepatitis B Immune Status",
    regex: /Hepatitis\s+B\s+[Ii]mmune\s+Status\s+([^\n]+)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },

  // Hepatitis C Tests
  {
    name: "Hepatitis C Antibody",
    regex: /Hepatitis\s+C\s+Antibody\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Hepatitis C Virus Interpretation",
    regex: /Hepatitis\s+C\s+Virus\s+[Ii]nterpretation\s+([^\n]+)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },

  {
    name: "Syphilis Antibody Screen",
    regex: /Syphilis\s+Antibody\s+Screen\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /Date Collected:\s*([^\n]+)/i,
        label: "Collection Date",
      },
    ],
  },
  {
    name: "Syphilis Serology Interpretation",
    regex:
      /Syphilis\s+Serology\s+[Ii]nterpretation\s+([^\n]+(?:infection|detected)\.)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
      {
        pattern: /Date Collected:\s*([^\n]+)/i,
        label: "Collection Date",
      },
    ],
  },

  // Herpes Tests
  {
    name: "Herpes Simplex Virus 1 IgG",
    regex:
      /Herpes\s+Simplex\s+Virus\s+1\s+IgG\s+CLIA\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Herpes Simplex Virus 2 IgG",
    regex:
      /Herpes\s+Simplex\s+Virus\s+2\s+IgG\s+CLIA\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Herpes Simplex Virus Interpretation",
    regex: /Herpes\s+Simplex\s+Virus\s+[Ii]nterpretation\s+([^\n]+)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },

  // HIV Tests
  {
    name: "HIV 1/2 Ag/Ab Combo Screen",
    regex:
      /HIV1\s*\/\s*2\s+Ag\/Ab\s+Combo\s+Screen\s+([A-Za-z-]+|\d+\s*[a-zA-Z/]+)/i, // Capture numeric values with units
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "HIV Final Interpretation",
    regex: /HIV\s+Final\s+[Ii]nterpretation\s+([^\n]+)/,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
];

const cleanResult = (result) => {
  if (!result) return "";
  return result.replace(/[^a-zA-Z0-9\s]/g, "").trim();
};

export const standardizeResult = (result, testType) => {
  console.log("Raw Result:", result); // Log the raw result
  result = cleanResult(result); // Ensure cleanResult is defined and working
  const lowerResult = result.toLowerCase().trim();

  // Handle numeric values with units (e.g., "101.16 mIU/mL")
  if (/^[\d.]+\s*[a-zA-Z/]+$/.test(result)) {
    console.log("Numeric Result Detected:", result); // Log numeric results
    return {
      result: TEST_RESULTS.NUMERIC,
      value: result, // Include the unit (e.g., "101.16 mIU/mL")
    };
  }

  // Handle "Non-Reactive"
  if (/^non-reactive$|^non reactive$/i.test(lowerResult)) {
    console.log("Non-Reactive Result Detected:", result); // Log Non-Reactive results
    return { result: TEST_RESULTS.NON_REACTIVE };
  }

  // Handle "Evidence of immunity"
  if (/evidence of immunity/i.test(lowerResult)) {
    console.log("Immune Result Detected:", result); // Log Immune results
    return { result: TEST_RESULTS.IMMUNE };
  }

  // Handle "No evidence of Hepatitis B Virus infection"
  if (/no evidence of hepatitis b virus infection/i.test(lowerResult)) {
    console.log("Negative Result Detected:", result); // Log Negative results
    return { result: TEST_RESULTS.NEGATIVE };
  }

  // Handle other negative patterns
  if (/^negative$|no evidence|absent|not detected/i.test(lowerResult)) {
    console.log("Negative Result Detected:", result); // Log Negative results
    return { result: TEST_RESULTS.NEGATIVE };
  }

  // Handle positive patterns - be more specific to avoid false matches
  if (/^positive$|^reactive$/i.test(lowerResult)) {
    console.log("Positive Result Detected:", result); // Log Positive results
    return { result: TEST_RESULTS.POSITIVE };
  }

  // Handle borderline cases
  if (/borderline|unclear|equivocal/.test(lowerResult)) {
    console.log("Indeterminate Result Detected:", result); // Log Indeterminate results
    return { result: TEST_RESULTS.INDETERMINATE };
  }

  // Default case
  console.log("Default Case - Indeterminate Result Detected:", result); // Log default case
  return { result: TEST_RESULTS.INDETERMINATE };
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

export const extractDateFromText = (text) => {
  // Combined regex to match multiple date formats
  const dateRegex =
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)|(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})|(\d{2}-\d{2}-\d{4})|(\d{2}-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-\d{4})/gi;

  const matches = text.match(dateRegex);

  if (matches && matches.length > 0) {
    // Get the current date and calculate the date 3 years ago
    const currentDate = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

    // Iterate through all matches and find the first valid date
    for (const match of matches) {
      const date = new Date(match);

      // Check if the date is valid and not older than 3 years
      if (!isNaN(date.getTime()) && date >= threeYearsAgo) {
        return match; // Return the first valid date
      }
    }
  }

  return null; // Return null if no valid date is found
};
export const findTestResults = (text) => {
  const results = [];
  const textBlock = typeof text === "string" ? text : text.toString();

  STI_TESTS.forEach((test) => {
    try {
      const match = textBlock.match(test.regex);

      if (match) {
        const rawResult = match[1].trim();
        console.log("RAW RESULT: ", rawResult);
        const { result, value } = standardizeResult(rawResult, test.name);

        // Ensure result is not undefined
        const standardizedResult = result || TEST_RESULTS.INDETERMINATE;

        // Get context around the match for better note extraction
        const contextStart = Math.max(0, match.index - 500);
        const contextEnd = Math.min(textBlock.length, match.index + 500);
        const context = textBlock.slice(contextStart, contextEnd);

        const notes = extractTestNotes(context, test, rawResult, value);

        results.push({
          test_type: test.name,
          result: standardizedResult, // Use the standardized result
          notes: notes || "No additional notes",
        });
      }
    } catch (error) {
      console.error(`Error processing test ${test.name}:`, error);
    }
  });

  return results;
};

// Helper function to dump the current patterns we're looking for
export const dumpTestPatterns = () => {
  STI_TESTS.forEach((test) => {
    console.log(`Test: ${test.name}`);
    console.log(`Regex: ${test.regex}`);
    console.log(`Note Patterns: ${JSON.stringify(test.notePatterns, null, 2)}`);
  });
};
