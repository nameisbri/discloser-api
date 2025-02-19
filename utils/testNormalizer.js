// Map variations of test names to standardized names
const TEST_TYPE_MAPPING = {
  // HIV tests
  "HIV 1/2 AG/AB COMBO SCREEN": "HIV-1/2 Antibody",
  "HIV1/2 AG/AB COMBO SCREEN": "HIV-1/2 Antibody",
  "HIV 1/2 ANTIBODY": "HIV-1/2 Antibody",
  "HIV FINAL INTERPRETATION": "HIV-1/2 Antibody",
  "HIV-1/2 AG/AB": "HIV-1/2 Antibody",

  // Hepatitis tests
  "HEPATITIS B SURFACE ANTIGEN": "Hepatitis B Surface Antigen",
  "HBV SURFACE ANTIGEN": "Hepatitis B Surface Antigen",
  "HEPATITIS B CORE TOTAL ANTIBODY": "Hepatitis B Core Antibody",
  "HBV CORE AB": "Hepatitis B Core Antibody",
  "HEPATITIS C ANTIBODY": "Hepatitis C Antibody",
  "HCV ANTIBODY": "Hepatitis C Antibody",

  // Syphilis tests
  "SYPHILIS ANTIBODY SCREEN": "Syphilis Antibody",
  "SYPHILIS SEROLOGY": "Syphilis Antibody",
  "SYPHILIS AB SCREEN": "Syphilis Antibody",
  "RPR": "Syphilis Antibody",

  // Gonorrhea tests
  "NEISSERIA GONORRHOEAE": "Gonorrhea",
  "N. GONORRHOEAE": "Gonorrhea",
  "GC CULTURE": "Gonorrhea",

  // Chlamydia tests
  "CHLAMYDIA TRACHOMATIS": "Chlamydia",
  "C. TRACHOMATIS": "Chlamydia",
  "CT CULTURE": "Chlamydia",

  // Herpes tests
  "HERPES SIMPLEX VIRUS 1 IGG": "HSV-1 Antibody",
  "HSV-1 IGG": "HSV-1 Antibody",
  "HERPES SIMPLEX VIRUS 2 IGG": "HSV-2 Antibody",
  "HSV-2 IGG": "HSV-2 Antibody",
};

export const normalizeTestType = (testType) => {
  if (!testType) return "Unknown Test";

  // Convert to uppercase for consistent matching
  const upperTestType = testType.toUpperCase();

  // Check if we have a direct mapping
  for (const [key, value] of Object.entries(TEST_TYPE_MAPPING)) {
    if (upperTestType === key) {
      return value;
    }
  }

  // Check for partial matches if no exact match found
  for (const [key, value] of Object.entries(TEST_TYPE_MAPPING)) {
    if (upperTestType.includes(key)) {
      return value;
    }
  }

  // If no match found, return original with proper capitalization
  return testType
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Group tests by category for better organization
export const getTestCategory = (testType) => {
  const normalizedType = normalizeTestType(testType);

  if (normalizedType.includes("HIV")) return "HIV";
  if (normalizedType.includes("Hepatitis")) return "Hepatitis";
  if (normalizedType.includes("Syphilis")) return "Syphilis";
  if (normalizedType.includes("Gonorrhea")) return "Bacterial";
  if (normalizedType.includes("Chlamydia")) return "Bacterial";
  if (normalizedType.includes("HSV")) return "Herpes";

  return "Other";
};

// Sort tests in a consistent order
export const getTestSortOrder = (testType) => {
  const categories = {
    "HIV": 1,
    "Hepatitis": 2,
    "Bacterial": 3,
    "Syphilis": 4,
    "Herpes": 5,
    "Other": 6,
  };

  return categories[getTestCategory(testType)] || 999;
};
