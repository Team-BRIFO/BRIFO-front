import { z } from 'zod'

const OAuthLoginResultSchema = z.object({
  loginType: z.enum(['LOGIN', 'SIGNUP_REQUIRED']),
  user: z
    .object({
      userId: z.string().uuid(),
      nickname: z.string(),
      email: z.string().optional(),
    })
    .optional(),
  token: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
      accessTokenExpiresIn: z.coerce.number().int(),
      refreshTokenExpiresIn: z.coerce.number().int(),
    })
    .optional(),
})

/** SIGNUP_REQUIRED 이후 token 없음. LOGIN 시 body token 사용 */
export const OAuthLoginResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  result: OAuthLoginResultSchema.optional(),
})

export type OAuthLoginResponseBody = z.infer<typeof OAuthLoginResponseSchema>
export type OAuthLoginResult = z.infer<typeof OAuthLoginResultSchema>
