import { create } from "zustand";
import { persist } from "zustand/middleware";

let adminStore = (set) => ({
    dopen: true,
    updateOpen: (dopen) => set((state) => ({ dopen: dopen })),
});

adminStore = persist(adminStore, { name: "my_admin_store" });
export const useAdminStore = create(adminStore);