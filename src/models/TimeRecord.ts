import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const timeRecordSchema = new Schema({
  time: { type: Date, required: true, default: Date.now },
});

export type TimeRecord = InferSchemaType<typeof timeRecordSchema>;

// 熱更新時避免 OverwriteModelError
export const TimeRecordModel: Model<TimeRecord> =
  (mongoose.models.TimeRecord as Model<TimeRecord>) ??
  mongoose.model<TimeRecord>("TimeRecord", timeRecordSchema);
