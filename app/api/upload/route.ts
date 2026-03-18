import { NextResponse } from "next/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { MAX_FILE_SIZE } from "@/lib/constants";

/**
 * Handles file upload requests and returns the Vercel Blob upload response.
 *
 * Authenticates the caller, enforces allowed content types and maximum file size,
 * attaches the uploader's `userId` to the upload token payload, and returns the
 * JSON response produced by the upload process. On error returns a JSON object
 * `{ error: string }` with HTTP status 401 for authentication failures or 500 for other errors.
 *
 * @param request - Incoming Request whose JSON body conforms to `HandleUploadBody`
 * @returns A NextResponse containing the upload result JSON on success, or `{ error: string }` with an appropriate HTTP status on failure
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();

        if (!userId) {
          throw new Error("Unauthorised user");
        }

        return {
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_FILE_SIZE,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("File uploaded to blob", blob.url);
        const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
        const userId = payload?.userId;

        //     TODO: Posthog
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("Unauthorised") ? 401 : 500;
    return NextResponse.json(
      {
        error: message,
      },
      { status },
    );
  }
}