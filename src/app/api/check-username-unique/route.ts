import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUp.schema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // this check is automatically handled in NEXTjs updated app router, so we can skip it, but keeping it here for reference
  // if(request.method != 'GET') {
  //     return Response.json({
  //         success: false,
  //         message: "Invalid request method" },
  //         { status: 405 })
  // }

  await dbConnect();

  // localhost:3000/api/check-username-unique?username=someusername?phone=1234567890
  try {
    const searchParams = new URL(request.url).searchParams;
    // create object, dont inject directly to zod, otherwise it will throw an error if the query param is missing
    const queryParam = { username: searchParams.get("username") || "" };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); //TODO: remove this log

    if (!result.success) {
      const formatted = z.treeifyError(result.error);
      const usernameErrors = formatted.properties?.username?.errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters: Invalid username",
          errors: usernameErrors,
        },
        { status: 400 },
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 409 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique and available.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while checking username uniqueness",
      },
      { status: 500 },
    );
  }
}
