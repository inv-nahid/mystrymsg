import { z } from "zod"

export const messageSchema = z.object({
    content: z
        .string()
        .min(1, "Message content cannot be empty")
        .max(200, "Message content cannot exceed 200 characters")
})