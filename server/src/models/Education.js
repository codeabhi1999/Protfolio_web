import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    startYear: {
      type: String,
      required: [true, 'Start year is required'],
    },
    endYear: {
      type: String,
      required: [true, 'End year is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
