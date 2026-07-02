import mongoose from 'mongoose';

const localeContentSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
  },
  { _id: false }
);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    seedKey: String,
    category: {
      type: String,
      enum: ['press', 'notice', 'event'],
      default: 'press',
    },
    summary: String,
    content: String,
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    locales: {
      type: Map,
      of: localeContentSchema,
      default: () => new Map(),
    },
  },
  { timestamps: true }
);

export default mongoose.model('News', newsSchema);
