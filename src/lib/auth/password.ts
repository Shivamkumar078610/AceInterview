import * as argon2 from 'argon2'

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  })
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password)
  } catch {
    return false
  }
}

export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('At least 8 characters')

  if (password.length >= 12) score++

  if (/[A-Z]/.test(password)) score++
  else feedback.push('At least one uppercase letter')

  if (/[a-z]/.test(password)) score++
  else feedback.push('At least one lowercase letter')

  if (/[0-9]/.test(password)) score++
  else feedback.push('At least one number')

  if (/[^A-Za-z0-9]/.test(password)) score++
  else feedback.push('At least one special character')

  return {
    valid: score >= 4 && password.length >= 8,
    score,
    feedback,
  }
}
