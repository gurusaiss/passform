import test from "node:test";
import assert from "node:assert/strict";
import { baseRegistrationSchema, validateCustomFields, phoneRegex } from "../src/lib/validation";
import { generateCsv, generateReferenceId } from "../src/lib/utils";
import { checkRateLimit } from "../src/lib/rate-limit";
import { verifyTurnstileToken } from "../src/lib/turnstile";
import { Registration } from "../src/types";

test("1. Validation: Phone number regex tests", () => {
  // Valid phone numbers
  assert.equal(phoneRegex.test("+91 98765 43210"), true);
  assert.equal(phoneRegex.test("9876543210"), true);
  assert.equal(phoneRegex.test("+1-555-123-4567"), true);
  assert.equal(phoneRegex.test("+44 20 7946 0991"), true);

  // Invalid phone numbers
  assert.equal(phoneRegex.test("abcde"), false);
  assert.equal(phoneRegex.test("1234"), false);
  assert.equal(phoneRegex.test("phone@number"), false);
});

test("2. Validation: Base registration schema tests", () => {
  // Valid payload
  const validData = {
    fullName: "John Doe",
    email: "JOHN.DOE@EXAMPLE.COM",
    phone: "+91 98765 43210",
    consentGiven: true,
  };
  const parseResult = baseRegistrationSchema.safeParse(validData);
  assert.equal(parseResult.success, true);
  if (parseResult.success) {
    // Normalization check: Email must be trimmed and lowercase
    assert.equal(parseResult.data.email, "john.doe@example.com");
    assert.equal(parseResult.data.fullName, "John Doe");
  }

  // Missing consent test
  const missingConsent = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    consentGiven: false,
  };
  const consentResult = baseRegistrationSchema.safeParse(missingConsent);
  assert.equal(consentResult.success, false);

  // Invalid email format
  const badEmail = {
    fullName: "John Doe",
    email: "not-an-email",
    phone: "+91 98765 43210",
    consentGiven: true,
  };
  const emailResult = baseRegistrationSchema.safeParse(badEmail);
  assert.equal(emailResult.success, false);
});

test("3. Validation: Custom fields validation", () => {
  // Missing required custom field
  const missingFields = {};
  const res1 = validateCustomFields(missingFields);
  assert.equal(res1.valid, false);
  assert.ok(res1.errors.organization);

  // Valid custom fields
  const completeFields = {
    organization: "MIT",
    role: "Student (1st / 2nd Year)",
  };
  const res2 = validateCustomFields(completeFields);
  assert.equal(res2.valid, true);

  // Invalid dropdown option
  const invalidSelect = {
    organization: "MIT",
    role: "Astronaut on Mars",
  };
  const res3 = validateCustomFields(invalidSelect);
  assert.equal(res3.valid, false);
  assert.ok(res3.errors.role);
});

test("4. Security: CSV formula injection neutralization", () => {
  const maliciousRegistrations: Registration[] = [
    {
      id: "test-1",
      reference_id: "SUMMIT-2026-X1Y2",
      full_name: "=1+1+cmd|' /C calc'!A0",
      email: "@exploit@example.com",
      phone: "+91-9999999999",
      custom_fields: {},
      registration_status: "confirmed",
      consent_given: true,
      turnstile_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "test-2",
      reference_id: "SUMMIT-2026-A3B4",
      full_name: "-2+3",
      email: "+malicious@example.com",
      phone: "1234567890",
      custom_fields: {},
      registration_status: "confirmed",
      consent_given: true,
      turnstile_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const csv = generateCsv(maliciousRegistrations);

  // Assert that dangerous characters at start of cells are prepended with an apostrophe (')
  assert.ok(csv.includes("''=1+1+cmd") || csv.includes("'=1+1+cmd"));
  assert.ok(csv.includes("''@exploit") || csv.includes("'@exploit"));
  assert.ok(csv.includes("''-2+3") || csv.includes("'-2+3"));
  assert.ok(csv.includes("''+malicious") || csv.includes("'+malicious"));
});

test("5. Utilities: Collision-resistant reference code format", () => {
  const ref1 = generateReferenceId("TEST");
  const ref2 = generateReferenceId("TEST");

  assert.ok(ref1.startsWith("TEST-2026-"));
  assert.ok(ref2.startsWith("TEST-2026-"));
  assert.notEqual(ref1, ref2);
  assert.equal(ref1.length, 14); // TEST-2026-XXXX = 4 + 1 + 4 + 1 + 4 = 14
});

test("6. Security: IP Rate Limiter", () => {
  const testIp = `192.168.1.${Math.floor(Math.random() * 200) + 1}`;

  // Consume 3 requests
  assert.equal(checkRateLimit(testIp, 3, 60000).isAllowed, true);
  assert.equal(checkRateLimit(testIp, 3, 60000).isAllowed, true);
  assert.equal(checkRateLimit(testIp, 3, 60000).isAllowed, true);

  // 4th request must be blocked
  const blocked = checkRateLimit(testIp, 3, 60000);
  assert.equal(blocked.isAllowed, false);
  assert.equal(blocked.remaining, 0);
});

test("7. Security: Turnstile verification logic", async () => {
  // Test token bypass in development mode
  const testResult = await verifyTurnstileToken("any-token-in-dev");
  assert.equal(testResult.success, true);

  // Missing token in strict mode test
  const missingResult = await verifyTurnstileToken(undefined);
  // When no token is passed, it must return false or missing error
  assert.equal(missingResult.success, false);
});
