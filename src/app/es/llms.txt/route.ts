import { localeLlmsResponse } from "@/lib/locale-llms";

/** /es/llms.txt — this locale's guides and news for answer engines (src/lib/locale-llms.ts). */
export const dynamic = "force-static";

export function GET(): Response {
  return localeLlmsResponse("es");
}
