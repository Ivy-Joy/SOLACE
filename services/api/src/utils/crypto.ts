// services/api/src/utils/crypto.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is missing");

  // Use a 32-byte hex key in env
  const buffer = Buffer.from(key, "hex");
  if (buffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes hex");
  }
  return buffer;
}

export function encryptField(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decryptField(payload: string): string {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");
  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}