export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  challengeTs?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!token) {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  // In development, if secret key is not set or test secret is used, allow test tokens
  if (!secretKey || secretKey === "1x0000000000000000000000000000000AA") {
    // If it's the test secret or no secret configured in dev mode, grant pass
    if (process.env.NODE_ENV !== "production") {
      return { success: true };
    }
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey || "");
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();

    return {
      success: Boolean(data.success),
      errorCodes: data["error-codes"],
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
    };
  } catch (error) {
    console.error("Turnstile verification network error:", error);
    return {
      success: false,
      errorCodes: ["internal-network-error"],
    };
  }
}
