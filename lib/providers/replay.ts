import { replayFixture } from "../domain";

export const replayProvider = {
  label: "Replay" as const,
  simulated: true as const,
  load: () => replayFixture,
};
