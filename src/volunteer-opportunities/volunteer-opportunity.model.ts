import mongoose, { Document, Schema } from 'mongoose';

export interface VolunteerOpportunity extends Document {
  title: string;
  description: string;
  photo: string; // Store image data as a base64 string
  date: string;
  location: string;
}

export const VolunteerOpportunitySchema = new Schema<VolunteerOpportunity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true }, // Changed to String type
    location: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true },
);

export const VolunteerOpportunityModel = mongoose.model<VolunteerOpportunity>(
  'VolunteerOpportunity',
  VolunteerOpportunitySchema,
);
