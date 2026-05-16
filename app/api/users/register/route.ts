import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  console.log(">>> API Register Route hit!");

  try {
    const body = await req.json();

    const apiRes = await api.post("users/register", body);

    return NextResponse.json(apiRes.data, { status: 201 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Axios Error in Register:", error.response?.data);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Помилка реєстрації на сервері",
        },
        { status: error.response?.status || 400 },
      );
    }

    console.error("Unknown Error in Register:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера Next.js" },
      { status: 500 },
    );
  }
}
