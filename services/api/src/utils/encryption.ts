import crypto from "crypto"

const ALGO = "aes-256-cbc"
const KEY = crypto.createHash("sha256").update(process.env.ENCRYPTION_SECRET ?? "").digest()

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGO, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(data: string): string {
  const [ivHex, encryptedHex] = data.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString()
}