const bannedWords = ["casino", "viagra", "loan", "crypto profit"]

export function isSpam(text: string): boolean {
  const lower = text.toLowerCase()
  return bannedWords.some(word => lower.includes(word))
}