import { connection } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

// 給 cron 呼叫：每次 GET 都新增一筆時間資料
export async function GET() {
  // 確保在請求當下執行，不會在 build 時被預先渲染
  await connection();

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
