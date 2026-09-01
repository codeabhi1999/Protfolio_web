import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    icon: {
      type: String, // String representation of an icon name (e.g. 'FaCode', 'FaServer')
      default: '',
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
