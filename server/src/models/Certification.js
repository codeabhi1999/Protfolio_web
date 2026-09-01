import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    credentialId: {
      type: String,
      trim: true,
      default: '',
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String, // Store image relative path or URL
      default: '',
    },
  },
  { timestamps: true }
);

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
