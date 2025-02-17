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
  // LifeLabs Format Tests
  {
    name: "Chlamydia trachomatis",
    regex: /CHLAMYDIA\s+TRACHOMATIS\s+([A-Za-z-]+)/i,
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
    regex: /NEISSERIA\s+GONORRHOEAE\s+([A-Za-z-]+)/i,
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
    regex: /TRICHOMONAS\s+VAGINALIS\s+([A-Za-z-]+)/i,
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
    regex: /Hepatitis\s+A\s+IgG\s+Antibody\s+([A-Za-z-]+)/i,
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

  // Hepatitis B Tests
  {
    name: "Hepatitis B Surface Antigen",
    regex: /Hepatitis\s+B\s+Surface\s+Antigen\s+(Non-Reactive[^\n]*)/i,
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
      /Hepatitis\s+B\s+Core\s+Total\s+\(IgG\+IgM\)\s+Antibody\s+(Non-Reactive[^\n]*)/i,
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
    regex: /Hepatitis\s+C\s+Antibody\s+([A-Za-z-]+)/i,
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
    regex: /Syphilis\s+Antibody\s+Screen\s+([A-Za-z-]+)/i,
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
    regex: /Herpes\s+Simplex\s+Virus\s+1\s+IgG\s+CLIA\s+([A-Za-z-]+)/i,
    notePatterns: [
      {
        pattern: /Source:\s*([^\n]+)/i,
        label: "Source",
      },
    ],
  },
  {
    name: "Herpes Simplex Virus 2 IgG",
    regex: /Herpes\s+Simplex\s+Virus\s+2\s+IgG\s+CLIA\s+([A-Za-z-]+)/i,
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
    regex: /HIV1\s*\/\s*2\s+Ag\/Ab\s+Combo\s+Screen\s+([A-Za-z-]+)/i,
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
  // Remove date and flags pattern (e.g., "2022-11-02 *H")
  return result.replace(/\s+\d{4}-\d{2}-\d{2}\s+\*[A-Z]$/, "").trim();
};

export const standardizeResult = (result, testType) => {
  result = cleanResult(result);
  const lowerResult = result.toLowerCase().trim();

  // Handle numeric values
  if (/^[\d.]+\s*[a-zA-Z/]+$/.test(result)) {
    return {
      result: TEST_RESULTS.NUMERIC,
      value: result,
    };
  }

  // Handle exact "Non-Reactive" matches first
  if (/^non-reactive$|^non reactive$/i.test(lowerResult)) {
    return { result: TEST_RESULTS.NEGATIVE };
  }

  // Handle Syphilis specific interpretations
  if (testType === "Syphilis Serology Interpretation") {
    if (lowerResult.includes("no serological evidence")) {
      return { result: TEST_RESULTS.NEGATIVE };
    }
  }

  // Handle immunity patterns
  if (/evidence of immunity|immune/.test(lowerResult)) {
    return { result: TEST_RESULTS.IMMUNE };
  }

  // Handle other negative patterns
  if (/^negative$|no evidence|absent|not detected/i.test(lowerResult)) {
    return { result: TEST_RESULTS.NEGATIVE };
  }

  // Handle positive patterns - be more specific to avoid false matches
  if (/^positive$|^reactive$/i.test(lowerResult)) {
    return { result: TEST_RESULTS.POSITIVE };
  }

  // Handle borderline cases
  if (/borderline|unclear|equivocal/.test(lowerResult)) {
    return { result: TEST_RESULTS.INDETERMINATE };
  }

  // Default case
  return { result: TEST_RESULTS.INDETERMINATE };
};

const removeDuplicateNotes = (notes) => {
  return [...new Set(notes)].filter(Boolean);
};

const extractTestNotes = (text, testConfig, result, value = null) => {
  const notes = [];

  // Extract date and flags
  const dateFlag = result.match(/(\d{4}-\d{2}-\d{2})\s+(\*[A-Z])$/);
  if (dateFlag) {
    notes.push(`Date Approved: ${dateFlag[1]}`);
    notes.push(`Flag: ${dateFlag[2]}`);
  }

  // Add numeric value to notes if present
  if (value) {
    notes.push(`Value: ${value}`);
  }

  // Look for Syphilis-specific notes
  if (text.includes("No confirmatory testing is performed")) {
    notes.push(
      "Lab Note: No confirmatory testing is performed on samples with non-reactive screening results"
    );
  }

  if (text.includes("clinical suspicion of early syphilis")) {
    notes.push(
      "Lab Note: If clinical suspicion of early syphilis, suggest single repeat serology in 4 weeks if not repeated already"
    );
  }

  if (text.includes("high risk groups")) {
    notes.push(
      "Lab Note: Persons in high risk groups who are nonreactive should be retested for up to three (3) months following possible exposure"
    );
  }

  // Process specimen info
  testConfig.notePatterns.forEach(({ pattern, label }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      notes.push(`${label}: ${match[1].trim()}`);
    }
  });

  // Process additional lab notes
  const notePatterns = [
    /Note:\s+([^\n]+)/g,
    /Please note[^.]+\./g,
    /Results to be interpreted[^.]+\./g,
  ];

  notePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((note) => {
        const cleanNote = note.replace(/^(Note:|Please note)/, "").trim();
        notes.push(`Lab Note: ${cleanNote}`);
      });
    }
  });

  return [...new Set(notes)].filter(Boolean).join(" | ");
};

export const findTestResults = (text) => {
  const results = [];
  const textBlock = typeof text === "string" ? text : text.toString();

  STI_TESTS.forEach((test) => {
    const match = textBlock.match(test.regex);

    if (match && match[1]) {
      const rawResult = match[1].trim();
      const { result, value } = standardizeResult(rawResult, test.name);

      const contextStart = Math.max(0, match.index - 500);
      const contextEnd = Math.min(textBlock.length, match.index + 500);
      const context = textBlock.slice(contextStart, contextEnd);

      const notes = extractTestNotes(context, test, rawResult, value);

      results.push({
        test_type: test.name,
        result: result,
        notes: notes || "No additional notes",
      });
    }
  });

  return results;
};
