const BASE_URL = "https://speedhub-back.onrender.com/api/reviews";

export interface Review {
    _id: string;
    name: string;
    surname: string;
    userStatus: string;
    text: string;
    isApproved: boolean;
    createdAt?: string;
}

const getJwtFromCookies = (): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const tokenValue = cookies
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    if (tokenValue && tokenValue.startsWith("eyJ")) return tokenValue;
    const fallback =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (fallback && fallback.startsWith("eyJ")) return fallback;
    return null;
};

export const reviewAdminService = {
    getAllReviews: async (): Promise<Review[]> => {
        const token = getJwtFromCookies();
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
            },
        });
        if (!response.ok) throw new Error("Помилка завантаження відгуків");
        return response.json();
    },

    approveReview: async (mongoId: string): Promise<Review> => {
        const token = getJwtFromCookies();
        const response = await fetch(`${BASE_URL}/${mongoId}/approve`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Помилка при затвердженні відгуку");
        return response.json();
    },

    deleteReview: async (mongoId: string): Promise<void> => {
        const token = getJwtFromCookies();
        const response = await fetch(`${BASE_URL}/${mongoId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Не вдалося видалити відгук");
    },
};