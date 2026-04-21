import { redirect } from "next/navigation";

export default function Home() {
  // Restoration: Forcing the application back to the "Older Version" Stitch UI
  redirect("/stitch/overview_dashboard.html");
}
