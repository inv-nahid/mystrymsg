import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystry Message | Verification Code",
            react: VerificationEmail({ username, otp: verifyCode })
        })
        console.log("Email send result:", result)
        if (result.error) {
            return {
                success: false,
                message: `Failed to send verification email: ${result.error.message}`,
            }
        }
        return {
            success: true,
            message: "Verification email sent successfully",
        }
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError)
        return {
            success: false,
            message: "Failed to send verification email",
        }
    }
}