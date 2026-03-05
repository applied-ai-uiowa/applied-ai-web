import { isAdmin } from "@/lib/auth";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const adminAccess = await isAdmin();
  return <HeaderClient adminAccess={adminAccess} />;
}
