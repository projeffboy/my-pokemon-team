import type { GenerationTransferData } from "@/types";

let data: Promise<GenerationTransferData> | undefined;
export function loadGenerationTransferData() {
  return (data ??= import("@/data/generation-transfer.json", {
    with: { type: "json" },
  }).then(module => module.default));
}
