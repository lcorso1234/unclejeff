import { readFile } from "node:fs/promises";
import path from "node:path";

import { createVCardResponse } from "@/lib/vcard";

export async function GET() {
  const photoPath = path.join(process.cwd(), "public", "best.png");
  const photoBase64 = await readFile(photoPath, { encoding: "base64" });

  return createVCardResponse({
    filename: "Jeff_Bartosz_Best-Tronics.vcf",
    fullName: "Jeff Bartosz",
    organization: "Best-Tronics Manufacturing Inc.",
    title: "Best-Tronics Manufacturing",
    phone: "+1-708-878-4215",
    email: "jeff@best-tronics.com",
    photoBase64,
    photoType: "PNG",
    note: "Quality and Service",
  });
}
