import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

/* Global State Manager, 
    Creating this in one place so we can use it everywhere.
*/

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: () => {
    try {
        const res = axiosInstance.get("/auth/check");
        set({authUser: res.data})
    } catch (error) {
        console.log("Error in checkAuth: ", error);
         set({authUser: null})
    } finally {
         set({authUser: false})
    }
  }
}));
