import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    year: String,
    event: String,
  },
  { _id: false }
);

const localeContentSchema = new mongoose.Schema(
  {
    name: String,
    tagline: String,
    vision: String,
    mission: String,
    address: String,
    ceoMessage: String,
    values: [String],
    history: [historySchema],
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: String,
    tagline: String,
    vision: String,
    mission: String,
    founded: String,
    address: String,
    phone: String,
    email: String,
    ceoMessage: String,
    values: [String],
    history: [historySchema],
    locales: {
      type: Map,
      of: localeContentSchema,
      default: () => new Map(),
    },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
