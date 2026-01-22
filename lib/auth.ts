import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
