import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
    },
    startDate: {
      type: String, // String format (e.g., 'Jan 2023' or '2023-01')
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String, // 'Present' or date string
      default: 'Present',
    },
    location: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
