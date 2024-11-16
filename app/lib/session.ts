import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "../types/Index";



const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);


// ===> Set Session Cookie
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
}
// ***

// ===> Remove Session Cookie
export async function deleteSession() {
    (await cookies()).delete("session");
}
// ***

// ===> Set Jwt Session
export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}
// ***

// ===> Verify Jwt Session
export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session");
        return {
            message: "Failed to verify session",
        }
    }
}
// ***