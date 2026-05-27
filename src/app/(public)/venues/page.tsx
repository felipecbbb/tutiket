import { redirect } from "next/navigation";

/** /venues redirige a /sectores — ya no listamos locales públicamente. */
export default function VenuesPage() {
  redirect("/eventos");
}
