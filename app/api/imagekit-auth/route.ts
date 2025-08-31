// /app/api/imagekit-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // Debug environment variables (without exposing full keys)
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    console.log("Environment check:", {
      hasPrivateKey: !!privateKey,
      privateKeyPrefix: privateKey?.substring(0, 10) + "...",
      hasPublicKey: !!publicKey,
      publicKeyPrefix: publicKey?.substring(0, 10) + "...",
    });

    if (!privateKey || !publicKey) {
      throw new Error("ImageKit keys are missing from environment variables");
    }

    if (!privateKey.startsWith("private_")) {
      throw new Error("Private key should start with 'private_'");
    }

    if (!publicKey.startsWith("public_")) {
      throw new Error("Public key should start with 'public_'");
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: privateKey,
      publicKey: publicKey,
    });

    console.log("Auth params generated successfully:", {
      hasToken: !!token,
      hasExpire: !!expire,
      hasSignature: !!signature,
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey: publicKey,
    });
  } catch (error: string | any) {
    console.error("Error in imagekit-auth route:", error);
    return Response.json(
      {
        error: "Failed to generate auth parameters",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
