import { connection } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

// 給 cron 呼叫：每次 GET 都新增一筆時間資料
// 需帶 header：Authorization: Bearer <CRON_SECRET>
export async function GET(request: Request) {
  // 確保在請求當下執行，不會在 build 時被預先渲染
  await connection();

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET 環境變數未設定");
    return Response.json(
      { success: false, message: "伺服器設定錯誤" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json(
      { success: false, message: "未授權" },
      { status: 401 },
    );
  }

  try {
    await connectToDatabase();
    const record = await TimeRecordModel.create({ time: new Date() });

    return Response.json(
      { success: true, data: { id: record._id, time: record.time } },
      { status: 201 },
    );
  } catch (error) {
    console.error("建立時間資料失敗：", error);
    return Response.json(
      { success: false, message: "建立時間資料失敗" },
      { status: 500 },
    );
  }
}
