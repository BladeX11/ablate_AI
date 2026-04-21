import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Restoration: Forcing the application back to the "Older Version" Stitch UI
  redirect("/stitch/overview_dashboard.html");
}
