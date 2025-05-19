import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated succesfully.");
    } catch (error) {
      toast.error(error.response.data.message);  
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
