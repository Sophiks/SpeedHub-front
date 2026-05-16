import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-back.onrender.com/api/admin";

const getJwtFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const tokenValue = cookies
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (tokenValue && tokenValue.startsWith("eyJ")) {
    return tokenValue;
  }

  const fallback = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (fallback && fallback.startsWith("eyJ")) {
    return fallback;
  }

  return null;
};

export const adminService = {

  getAllUsers: async (): Promise<User[]> => {
    const token = getJwtFromCookies();

    // Лог для перевірки: що саме ми дістали
    console.log("🔍 [AdminService] Використовуємо токен:", 
      token ? `${token.substring(0, 15)}...` : "❌ НЕ ЗНАЙДЕНО АБО INVALID");

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ Помилка ${response.status}: Доступ заборонено або токен недійсний`);
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const token = getJwtFromCookies();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Update failed");
    return response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const token = getJwtFromCookies();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Delete failed");
  },
};