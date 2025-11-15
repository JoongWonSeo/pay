import { synced, type SyncOptions } from "ws-sync";
import { create } from "zustand";
import {
  devtools,
  persist,
  type DevtoolsOptions,
  type PersistOptions,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export function createStore<State>({
  initialState,
  devtoolsOptions,
}: {
  initialState: State;
  devtoolsOptions?: DevtoolsOptions;
}) {
  // prettier-ignore
  const useStore = create<State>()(
    devtools(
      immer(
        () => initialState,
      ),
      devtoolsOptions,
    ),
  );
  return useStore;
}

// a simple wrapper to define all middleware in one place, only works if you have external actions (i.e. only states in the store)
export function createPersistedStore<
  State,
  P extends PersistOptions<State, unknown> = PersistOptions<State, unknown>
>({
  initialState,
  persistOptions,
  devtoolsOptions,
}: {
  initialState: State;
  persistOptions: P;
  devtoolsOptions?: DevtoolsOptions;
}) {
  // prettier-ignore
  const useStore = create<State>()(
      devtools(
        persist( // to localStorage
          immer(
            () => initialState
          ),
          persistOptions,
        ),
        devtoolsOptions,
      )
    );
  return useStore;
}

export function createSyncedStore<
  State,
  P extends PersistOptions<State, unknown> = PersistOptions<State, unknown>
>({
  initialState,
  syncOptions,
  persistOptions,
  devtoolsOptions,
}: {
  initialState: State;
  syncOptions: SyncOptions;
  persistOptions?: P;
  devtoolsOptions?: DevtoolsOptions;
}) {
  // prettier-ignore
  const useStore = create<State>()(
      devtools(
        persist( // to localStorage
          synced(
            () => initialState,
            syncOptions,
          ),
          persistOptions ?? {name: "DISABLED", partialize: () => ({}), skipHydration: true},
        ),
        devtoolsOptions,
      )
    );
  return useStore;
}
