import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const setupSupabaseDatabase = async () => {
  console.log('===============================================================');
  console.log('⚡ SUPABASE POSTGRESQL AUTOMATED DATABASE SETUP & SEEDER');
  console.log('===============================================================');

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is missing from server/.env');
    process.exit(1);
  }

  if (connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('⚠️  ACTION REQUIRED:');
    console.error('Please open server/.env and replace [YOUR-PASSWORD] with your actual Supabase database password in DATABASE_URL.');
    console.log('\nExample:');
    console.log('  DATABASE_URL=postgresql://postgres:MySecurePass123!@db.sfmmdbrmzqioheheirgv.supabase.co:5432/postgres\n');
    process.exit(1);
  }

  console.log('Connecting to Supabase PostgreSQL...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL database!');

    // 1. Execute SQL Schema
    console.log('\n[1/3] Applying table schema (server/supabase_schema.sql)...');
    const schemaPath = path.join(__dirname, '../../supabase_schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');
    await client.query(sqlContent);
    console.log('✓ Tables, triggers, and Row Level Security policies created successfully!');

    // 2. Hash and seed admin user
    console.log('\n[2/3] Seeding Administrator Account...');
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await client.query(`DELETE FROM public.admin_users WHERE email = $1`, [adminEmail]);
    await client.query(
      `INSERT INTO public.admin_users (email, password, role) VALUES ($1, $2, 'admin')`,
      [adminEmail, hashedPassword]
    );
    console.log(`✓ Admin user created: ${adminEmail}`);

    // 3. Seed Portfolio Data
    console.log('\n[3/3] Seeding Profile, Skills, Projects, Experience, and Education...');
    
    // Profile
    await client.query(`DELETE FROM public.profiles`);
    await client.query(
      `INSERT INTO public.profiles (name, role, title, bio, location, email, phone, profile_image, resume_url, social_links)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        'Abhijeet Chavan',
        '.NET Developer',
        '.NET Developer',
        '.NET Developer with 1.8 years of experience in designing, developing, and deploying web applications using ASP.NET, MVC, C#, SQL Server, and frontend technologies like HTML5, CSS3, JavaScript, and Bootstrap Angular. Hands-on experience in Web API development. Proficient in building responsive user interfaces, optimizing database performance.',
        'Nagpur, Maharashtra, INDIA',
        'chavanabhijeet95@gmail.com',
        '7057731248',
        '/uploads/profile_placeholder.jpg',
        '/uploads/resume_placeholder.pdf',
        JSON.stringify({
          github: 'https://github.com/abhijeetchavan',
          linkedin: 'https://linkedin.com/in/abhijeetchavan',
          instagram: 'https://instagram.com/abhijeetchavan',
        }),
      ]
    );

    // Skills
    await client.query(`DELETE FROM public.skills`);
    const skills = [
      ['C#', 'Backend', 'Advanced', 92],
      ['ASP.NET Core', 'Backend', 'Advanced', 90],
      ['ASP.Net Web Api', 'Backend', 'Advanced', 90],
      ['MVC', 'Backend', 'Advanced', 88],
      ['C++', 'Backend', 'Advanced', 82],
      ['Microsoft SQL server', 'Database', 'Advanced', 90],
      ['HTML5', 'Frontend', 'Advanced', 95],
      ['CSS3', 'Frontend', 'Advanced', 92],
      ['JavaScript', 'Frontend', 'Advanced', 88],
      ['Bootstrap', 'Frontend', 'Advanced', 90],
      ['Angular', 'Frontend', 'Intermediate', 75],
      ['jQuery', 'Frontend', 'Intermediate', 80],
      ['Visual Studio', 'Tools', 'Advanced', 95],
      ['Git', 'Tools', 'Advanced', 88],
      ['GitHub', 'Tools', 'Advanced', 90],
    ];
    for (const [name, category, level, proficiency] of skills) {
      await client.query(
        `INSERT INTO public.skills (name, category, level, proficiency) VALUES ($1, $2, $3, $4)`,
        [name, category, level, proficiency]
      );
    }

    // Projects
    await client.query(`DELETE FROM public.projects`);
    await client.query(
      `INSERT INTO public.projects (title, slug, description, detailed_description, technologies, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'E-commerce Web Application',
        'e-commerce-web-application',
        'Developed a full-stack E-commerce Web Application with product catalog, shopping cart, and order management.',
        'Implemented secure user authentication, Razorpay payments, and Shiprocket tracking in ASP.NET and SQL Server.',
        JSON.stringify(['ASP.NET', 'C#', 'SQL Server', 'HTML', 'CSS', 'JavaScript', 'Razorpay', 'Shiprocket']),
        '.NET',
        true,
      ]
    );
    await client.query(
      `INSERT INTO public.projects (title, slug, description, detailed_description, technologies, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'HMIS Duty Assignment Module',
        'hmis-duty-assignment-module',
        'Developed a Duty Assignment Module for hospital staff with ward-wise duty allocation.',
        'Enabled duty scheduling by ward number, timing, and assigned doctor/staff in hospital environments.',
        JSON.stringify(['C#', 'ASP.NET', 'SQL Server', 'JavaScript', 'HTML', 'CSS']),
        '.NET',
        true,
      ]
    );

    // Experience
    await client.query(`DELETE FROM public.experiences`);
    await client.query(
      `INSERT INTO public.experiences (company, position, start_date, end_date, location, responsibilities, technologies)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'Global IT Services and Solutions',
        'Dot Net Developer',
        '09/2023',
        'Present',
        'Nagpur, Maharashtra, INDIA',
        JSON.stringify([
          'Developed user-friendly interfaces for the LISEP ICU Management System.',
          'Built responsive web pages using HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.',
          'Created a duty scheduling module for HMIS, managing shifts and patient assignments.',
          'Currently building a company website with enhanced UI and animations.',
          'I have worked on-site at Yavatmal Vasantrao Naik Hospital.',
        ]),
        JSON.stringify(['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS', 'ASP.NET', 'C#', 'SQL Server']),
      ]
    );

    // Education
    await client.query(`DELETE FROM public.educations`);
    await client.query(
      `INSERT INTO public.educations (degree, institution, start_year, end_year, description) VALUES ($1, $2, $3, $4, $5)`,
      [
        'Master of Computer Applications (MCA)',
        'Prof. Ram Meghe Institute of Technology & Research Badnera Rly.',
        '2020',
        '2022',
        'Graduated with 9.0 CGPA distinction. Location: Amravati, India.',
      ]
    );
    await client.query(
      `INSERT INTO public.educations (degree, institution, start_year, end_year, description) VALUES ($1, $2, $3, $4, $5)`,
      [
        'Bachelor of Computer Application (BCA)',
        'Vidya Bhavan College of Management and Research',
        '2017',
        '2020',
        'Graduated with 7.2 CGPA. Location: Yavatmal, India.',
      ]
    );

    // Services
    await client.query(`DELETE FROM public.services`);
    const services = [
      ['Web Development', 'Crafting responsive, high-performance, and visually stunning web applications.', 'FaCode'],
      ['Backend Development', 'Designing secure, scalable microservices and RESTful APIs in ASP.NET Core or Node.js.', 'FaServer'],
      ['Database Development', 'Architecting robust database schemas and queries in SQL Server & PostgreSQL.', 'FaDatabase'],
      ['API Integration', 'Connecting payment gateways (Razorpay), logistics (Shiprocket), and Webhooks.', 'FaPlug'],
      ['Full Stack Development', 'End-to-end full-stack development from database design to modern React interfaces.', 'FaLaptopCode'],
    ];
    for (const [title, desc, icon] of services) {
      await client.query(
        `INSERT INTO public.services (title, description, icon) VALUES ($1, $2, $3)`,
        [title, desc, icon]
      );
    }

    client.release();
    console.log('\n===============================================================');
    console.log('🎉 SUCCESS: Supabase PostgreSQL database fully configured & seeded!');
    console.log('===============================================================');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Database connection/execution failed:', err.message);
    await pool.end();
    process.exit(1);
  }
};

setupSupabaseDatabase();
