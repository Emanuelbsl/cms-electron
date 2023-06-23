import { ActionAuth, StoreAuth } from "@shared/types/auth";
import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

const useAuthStore = create<StoreAuth & ActionAuth>()(
  persist(
    (set, get) => ({
      authenticated: null,
      isAuthenticated: false,
      login: (params: any) => {
        set((state) => ({
          ...state,
          authenticated: params,
          isAuthenticated: true,
        }));
      },
      logout: () => {
        set((state) => ({
          ...state,
          authenticated: null,
          isAuthenticated: false,
        }));
      },
    }),
    {
      name: "global-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        authenticated: state.authenticated,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
