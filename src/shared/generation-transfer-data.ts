import type { GenerationTransferData } from "@/types";

let data: Promise<GenerationTransferData> | undefined;
let loaded: GenerationTransferData | undefined;

export const generationTransferData = () => loaded;
export function loadGenerationTransferData() {
  return (data ??= import("@/data/generation-transfer.json", {
    with: { type: "json" },
  }).then(module => (loaded = module.default)));
}
