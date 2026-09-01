import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Other'],
    },
    level: {
      type: String,
      required: [true, 'Skill level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
