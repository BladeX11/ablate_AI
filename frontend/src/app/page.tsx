import { redirect } from "next/navigation";

export default function Home() {
  // Restoration: Forcing any entry point to the high-fidelity Stitch UI
  redirect("/stitch/overview_dashboard.html");
}
