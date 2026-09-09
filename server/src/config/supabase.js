import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query, isPostgresConfigured } from './postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

export { pool, query, isPostgresConfigured };

export const isSupabaseConfigured = () => {
  return Boolean(
    isPostgresConfigured() ||
    (
      supabaseUrl && 
      supabaseKey && 
      !supabaseUrl.includes('your-project-id') && 
      !supabaseKey.includes('your-supabase')
    )
  );
};

let supabaseInstance = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id') && !supabaseKey.includes('your-supabase')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log(`[Supabase] REST Client initialized for ${supabaseUrl}`);
  } catch (err) {
    console.error(`[Supabase] Initialization error:`, err.message);
  }
}

export const supabase = supabaseInstance;

/**
 * Normalizes a database record from Supabase into the schema expected by the frontend.
 * Ensures '_id' is populated alongside 'id' and converts snake_case to camelCase where applicable.
 */
export const normalizeRecord = (record) => {
  if (!record || typeof record !== 'object') return record;
  if (Array.isArray(record)) return record.map(normalizeRecord);

  const mapped = { ...record };
  if (record.id && !record._id) {
    mapped._id = record.id;
  }

  // Profile fields
  if (record.profile_image !== undefined) mapped.profileImage = record.profile_image;
  if (record.resume_url !== undefined) mapped.resumeUrl = record.resume_url;
  if (record.social_links !== undefined) mapped.socialLinks = record.social_links;

  // Project fields
  if (record.detailed_description !== undefined) mapped.detailedDescription = record.detailed_description;
  if (record.github_url !== undefined) mapped.githubUrl = record.github_url;
  if (record.live_url !== undefined) mapped.liveUrl = record.live_url;

  // Experience fields
  if (record.start_date !== undefined) mapped.startDate = record.start_date;
  if (record.end_date !== undefined) mapped.endDate = record.end_date;

  // Education fields
  if (record.start_year !== undefined) mapped.startYear = record.start_year;
  if (record.end_year !== undefined) mapped.endYear = record.end_year;

  // Certification fields
  if (record.issuing_organization !== undefined) mapped.issuingOrganization = record.issuing_organization;
  if (record.credential_id !== undefined) mapped.credentialId = record.credential_id;
  if (record.credential_url !== undefined) mapped.credentialUrl = record.credential_url;

  return mapped;
};

/**
 * Transforms a camelCase payload from the client into snake_case column names for Supabase.
 */
export const toSupabasePayload = (payload, table) => {
  if (!payload || typeof payload !== 'object') return payload;
  const out = {};

  for (const [key, value] of Object.entries(payload)) {
    if (key === '_id') continue;
    
    // Map known fields
    if (key === 'profileImage') out.profile_image = value;
    else if (key === 'resumeUrl') out.resume_url = value;
    else if (key === 'socialLinks') out.social_links = value;
    else if (key === 'detailedDescription') out.detailed_description = value;
    else if (key === 'githubUrl') out.github_url = value;
    else if (key === 'liveUrl') out.live_url = value;
    else if (key === 'startDate') out.start_date = value;
    else if (key === 'endDate') out.end_date = value;
    else if (key === 'startYear') out.start_year = value;
    else if (key === 'endYear') out.end_year = value;
    else if (key === 'issuingOrganization') out.issuing_organization = value;
    else if (key === 'credentialId') out.credential_id = value;
    else if (key === 'credentialUrl') out.credential_url = value;
    else {
      out[key] = value;
    }
  }

  return out;
};

export default supabase;
