import { z } from "zod"

export const verifySchema = z.object({
    code: z.string().length(3, { message: "Verification code must be exactly 3 digits" })
})