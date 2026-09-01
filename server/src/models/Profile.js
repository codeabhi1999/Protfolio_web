import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio description is required'],
    },
    location: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String, // Store image URL/relative file path
      default: '',
    },
    resumeUrl: {
      type: String, // Store resume URL/relative file path
      default: '',
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
