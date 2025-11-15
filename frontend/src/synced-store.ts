import { toast } from "sonner";
import { Session } from "ws-sync";
import { createSyncedStore } from "./store-config";
import {
  HelloSyncActionsKeys,
  type HelloSync,
  type HelloSyncActionsParams,
} from "./sync-client/types.gen";

// global ws-session
export const session = new Session(
  "http://localhost:8000/ws",
  "Backend",
  toast,
  "arraybuffer" // receive arraybuffer instead of blob
);
// automatically connect to the backend
session.connect();

// ========== state ========== //
export const useHelloSync = createSyncedStore<HelloSync>({
  initialState: {
    message: "not connected yet",
  },
  syncOptions: {
    key: "HelloSync",
    session,
  },
});

// ========== actions ========== //
const { setState: set, sync } = useHelloSync;

export const helloSync = {
  // remote actions, delegate to backend by default
  ...sync.createDelegators<HelloSyncActionsParams>()(HelloSyncActionsKeys),

  // local actions
  setMessage: (message: string) => {
    set({ message });
    sync();
  },
};
