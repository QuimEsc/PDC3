import type { Metadata } from "next";
import PdcApp from "./PdcApp";

export const metadata: Metadata = {
  title: "Laboratori PDC · Àmbit científic",
  description: "Aplicació gamificada per a l’àmbit científic de 3r ESO PDC.",
  openGraph: {
    title: "Laboratori PDC",
    description: "Entendre, provar i decidir amb ciència.",
    images: ["/og-laboratori-pdc.png"],
  },
};

export default function Home() {
  return <PdcApp />;
}
