import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "light",
    setTheme: (theme) => {
        localStorage.setItem("chata-theme", theme);
        set({theme})
    }
}))