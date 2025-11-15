import { toast } from "sonner";
import { Session } from "ws-sync";
import { createSyncedStore } from "./store-config";
import {
  BackendStateActionsKeys,
  type BackendState,
  type BackendStateActionsParams,
} from "./sync-client/types.gen";
import { zBackendState } from "./sync-client/zod.gen";

// global ws-session
export const session = new Session(
  "http://localhost:8000/ws/test-session",
  "Backend",
  toast,
  "arraybuffer" // receive arraybuffer instead of blob
);
// automatically connect to the backend
session.connect();

// ========== state ========== //
export const useBackend = createSyncedStore<BackendState>({
  initialState: zBackendState.parse({
    channels: [],
    postsByChannelId: {},
  }),
  syncOptions: {
    key: "BackendState",
    session,
  },
});

// ========== actions ========== //
const { setState: set, sync } = useBackend;

export const backend = {
  // remote actions, delegate to backend by default
  ...sync.createDelegators<BackendStateActionsParams>()(
    BackendStateActionsKeys
  ),

  // // local actions
  // setMessage: (message: string) => {
  //   set({ message });
  //   sync();
  // },
};
