const BASE_URL = "https://speedhub-back.onrender.com/api/lectures";

// Чіткий інтерфейс на основі полів твоєї бази даних MongoDB
export interface Lecture {
    _id: string;
    topic_id: string;
    topic_prefix: string;
    title: string;
    content_html: string;
}

// Функція для надійного витягування JWT токена
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

export const lectureAdminService = {
    // 1. Отримати всі лекції (GET /api/lectures)
    getAllLectures: async (): Promise<Lecture[]> => {
        const token = getJwtFromCookies();
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
            },
        });
        if (!response.ok) throw new Error("Помилка завантаження лекцій");
        return response.json();
    },

    // 2. Створити або Оновити лекцію (POST /api/lectures або PUT /api/lectures/:id)
    async saveLecture(lectureData: Partial<Lecture>, mongoId?: string): Promise<Lecture> {
        const token = getJwtFromCookies();
        const url = mongoId ? `${BASE_URL}/${mongoId}` : BASE_URL;
        const method = mongoId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lectureData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Помилка при збереженні лекції");
        }

        return response.json();
    },

    // 3. Видалити лекцію (DELETE /api/lectures/:id)
    deleteLecture: async (mongoId: string): Promise<void> => {
        const token = getJwtFromCookies();
        const response = await fetch(`${BASE_URL}/${mongoId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error("Не вдалося видалити лекцію");
    },
};