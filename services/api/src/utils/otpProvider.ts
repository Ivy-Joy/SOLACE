// This file is a provider adapter (Twilio, Africa's Talking, etc).
// For now keep a simple stub returning not configured if OTP_PROVIDER != mock.

export async function sendOTP(to: string, message: string): Promise<{ success: boolean; providerRef?: string; error?: string }> {
  // Example placeholder for production integrations
  return { success: false, error: "OTP provider not configured" };
}