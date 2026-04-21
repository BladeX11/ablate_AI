import { redirect } from "next/navigation";

export default function CatchAll() {
  // Restoration: Ensuring any broken or "new version" URLs redirect to the golden Stitch Dashboard
  redirect("/stitch/overview_dashboard.html");
}
