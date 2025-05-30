// src/constants/formTexts.ts

export const formTexts = {
  steps: ['Personal Info', 'Address', 'Professional', 'Review'],

  labels: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone Number',
    identityDocument: "Identity Document (Passport/ID)",
    Address:"Address",
    City:"City",
    ZIPCode:"ZIP Code",
    Country:"Country",
    ResidencyProof:"Proof of Residency",
    Qualifications:"Qualifications/Certifications",
    BusinessPermit: "Business Permit",
    InsurancePro:"Professional Liability Insurance",
    TaxNumber:"Tax Number (NIF)",
    VAT:"VAT Number",
    Bank:"Bank Details (IBAN)",
    CompanyStatutes:"Company Statutes (if applicable)",
    HourlyRate:"Hourly Rate (excl. VAT)",
    HalfHourRate:"Half-Hour Rate (excl. VAT)",
    PersonalInfo:"Personal Information",
    AdressInfo:"Adress Information",
    ProInfo:"Professional Information",
    UploadDoc:"Uploaded Documents"
  },

  errors: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    phoneRequired: 'Phone number is required',
    phoneMin: 'Phone number must have at least 5 digits',
    phoneMax: 'Phone number cannot exceed 20 digits',
    phoneInvalid: 'Invalid phone number (only digits, +, - and spaces allowed)',
    identityDocRequired:"Identity Document (Passport/ID) is required", 
  },

  boutton:{
    Continue:"Continue",
    Back:"Back",
    SubmitForm:"Submit Registration"
  },

  successMessagetext:{
    thankYou:"Thank You!",
    messageSubmit:"Your sports coach registration has been submitted successfully. We will review your information and contact you shortly.",
    messageConfirmation:"A confirmation email has been sent to your email address. Please check your inbox and follow any additional instructions if required.",
    submitAnotherForm:"Submit Another Registration"
  }
} as const;
