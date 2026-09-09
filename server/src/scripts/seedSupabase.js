import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedSupabaseDatabase = async () => {
  console.log('---------------------------------------------------------');
  console.log('🚀 SUPABASE DATABASE SEEDER');
  console.log('---------------------------------------------------------');

  if (!isSupabaseConfigured()) {
    console.error('❌ Error: Supabase credentials are not configured in server/.env!');
    console.log('\nPlease add the following lines to server/.env:');
    console.log('  SUPABASE_URL=https://your-project-id.supabase.co');
    console.log('  SUPABASE_KEY=your-supabase-service-role-or-anon-key');
    console.log('\nMake sure you have executed server/supabase_schema.sql in the Supabase SQL Editor first.');
    process.exit(1);
  }

  try {
    console.log('✅ Connecting to Supabase at:', process.env.SUPABASE_URL);

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    console.log(`\n[1/7] Seeding Admin User: ${adminEmail}...`);
    // Delete existing admin user with same email if present to avoid duplication
    await supabase.from('admin_users').delete().eq('email', adminEmail);
    const { error: adminError } = await supabase.from('admin_users').insert([
      {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      }
    ]);
    if (adminError) console.warn('Warning on admin user insert:', adminError.message);
    else console.log('✓ Admin user seeded successfully.');

    // 2. Seed Profile Data
    console.log('\n[2/7] Seeding Profile Details...');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        name: 'Abhijeet Chavan',
        role: '.NET Developer',
        title: '.NET Developer',
        bio: '.NET Developer with 1.8 years of experience in designing, developing, and deploying web applications using ASP.NET, MVC, C#, SQL Server, and frontend technologies like HTML5, CSS3, JavaScript, and Bootstrap Angular. Hands-on experience in Web API development. Proficient in building responsive user interfaces, optimizing database performance. Adept at collaborating with cross-functional teams to deliver scalable and efficient solutions. Passionate about leveraging technical expertise to drive organizational success and enhance user experiences.',
        location: 'Nagpur, Maharashtra, INDIA',
        email: 'chavanabhijeet95@gmail.com',
        phone: '7057731248',
        profile_image: '/uploads/profile_placeholder.jpg',
        resume_url: '/uploads/resume_placeholder.pdf',
        social_links: {
          github: 'https://github.com/abhijeetchavan',
          linkedin: 'https://linkedin.com/in/abhijeetchavan',
          instagram: 'https://instagram.com/abhijeetchavan',
        },
      }
    ]);
    if (profileError) console.warn('Warning on profile insert:', profileError.message);
    else console.log('✓ Profile seeded successfully.');

    // 3. Seed Skills
    console.log('\n[3/7] Seeding Skills Matrix...');
    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const skillsData = [
      { name: 'C#', category: 'Backend', level: 'Advanced', proficiency: 92 },
      { name: 'ASP.NET Core', category: 'Backend', level: 'Advanced', proficiency: 90 },
      { name: 'ASP.Net Web Api', category: 'Backend', level: 'Advanced', proficiency: 90 },
      { name: 'MVC', category: 'Backend', level: 'Advanced', proficiency: 88 },
      { name: 'C++', category: 'Backend', level: 'Advanced', proficiency: 82 },
      { name: 'Microsoft SQL server', category: 'Database', level: 'Advanced', proficiency: 90 },
      { name: 'HTML5', category: 'Frontend', level: 'Advanced', proficiency: 95 },
      { name: 'CSS3', category: 'Frontend', level: 'Advanced', proficiency: 92 },
      { name: 'JavaScript', category: 'Frontend', level: 'Advanced', proficiency: 88 },
      { name: 'Bootstrap', category: 'Frontend', level: 'Advanced', proficiency: 90 },
      { name: 'Angular', category: 'Frontend', level: 'Intermediate', proficiency: 75 },
      { name: 'jQuery', category: 'Frontend', level: 'Intermediate', proficiency: 80 },
      { name: 'Visual Studio', category: 'Tools', level: 'Advanced', proficiency: 95 },
      { name: 'Git', category: 'Tools', level: 'Advanced', proficiency: 88 },
      { name: 'GitHub', category: 'Tools', level: 'Advanced', proficiency: 90 },
    ];
    const { error: skillsError } = await supabase.from('skills').insert(skillsData);
    if (skillsError) console.warn('Warning on skills insert:', skillsError.message);
    else console.log(`✓ ${skillsData.length} skills seeded successfully.`);

    // 4. Seed Projects
    console.log('\n[4/7] Seeding Production Projects...');
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const projectsData = [
      {
        title: 'E-commerce Web Application',
        slug: 'e-commerce-web-application',
        description: 'Developed a full-stack E-commerce Web Application with product catalog, shopping cart, and order management.',
        detailed_description: 'Developed a full-stack E-commerce Web Application with product catalog, shopping cart, and order management. Implemented secure user authentication (login, registration, profile management). Integrated Razorpay for payments and Shiprocket for shipping & tracking. Built with ASP.NET, C#, SQL Server, HTML, CSS, JavaScript for robust backend and responsive UI.',
        technologies: ['ASP.NET', 'C#', 'SQL Server', 'HTML', 'CSS', 'JavaScript', 'Razorpay', 'Shiprocket'],
        category: '.NET',
        featured: true,
        github_url: '',
        live_url: '',
        image: '',
      },
      {
        title: 'HMIS Duty Assignment Module',
        slug: 'hmis-duty-assignment-module',
        description: 'Developed a Duty Assignment Module for hospital staff with ward-wise duty allocation.',
        detailed_description: 'Developed a Duty Assignment Module for hospital staff with ward-wise duty allocation. Enabled scheduling by ward number, timing, and assigned doctor/staff.',
        technologies: ['C#', 'ASP.NET', 'SQL Server', 'JavaScript', 'HTML', 'CSS'],
        category: '.NET',
        featured: true,
        github_url: '',
        live_url: '',
        image: '',
      },
    ];
    const { error: projectsError } = await supabase.from('projects').insert(projectsData);
    if (projectsError) console.warn('Warning on projects insert:', projectsError.message);
    else console.log(`✓ ${projectsData.length} projects seeded successfully.`);

    // 5. Seed Experience
    console.log('\n[5/7] Seeding Work Experience...');
    await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const experienceData = [
      {
        company: 'Global IT Services and Solutions',
        position: 'Dot Net Developer',
        start_date: '09/2023',
        end_date: 'Present',
        location: 'Nagpur, Maharashtra, INDIA',
        responsibilities: [
          'Developed user-friendly interfaces for the LISEP ICU Management System.',
          'Built responsive web pages using HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.',
          'Created a duty scheduling module for HMIS, managing shifts and patient assignments.',
          'Currently building a company website with enhanced UI and animations.',
          'I have worked on-site at Yavatmal Vasantrao Naik Hospital.',
        ],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS', 'ASP.NET', 'C#', 'SQL Server'],
        achievements: [],
      }
    ];
    const { error: expError } = await supabase.from('experiences').insert(experienceData);
    if (expError) console.warn('Warning on experience insert:', expError.message);
    else console.log('✓ Experience records seeded successfully.');

    // 6. Seed Education
    console.log('\n[6/7] Seeding Education Records...');
    await supabase.from('educations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const educationData = [
      {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'Prof. Ram Meghe Institute of Technology & Research Badnera Rly.',
        start_year: '2020',
        end_year: '2022',
        description: 'Graduated with 9.0 CGPA distinction. Location: Amravati, India.',
      },
      {
        degree: 'Bachelor of Computer Application (BCA)',
        institution: 'Vidya Bhavan College of Management and Research',
        start_year: '2017',
        end_year: '2020',
        description: 'Graduated with 7.2 CGPA. Location: Yavatmal, India.',
      }
    ];
    const { error: eduError } = await supabase.from('educations').insert(educationData);
    if (eduError) console.warn('Warning on education insert:', eduError.message);
    else console.log(`✓ ${educationData.length} education records seeded successfully.`);

    // 7. Seed Services
    console.log('\n[7/7] Seeding Services...');
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const servicesData = [
      {
        title: 'Web Development',
        description: 'Crafting responsive, high-performance, and visually stunning web applications tailored to business requirements using modern technologies.',
        icon: 'FaCode',
      },
      {
        title: 'Backend Development',
        description: 'Designing secure, scalable microservices, RESTful APIs, and background processing systems in C# ASP.NET Core or Node.js.',
        icon: 'FaServer',
      },
      {
        title: 'Database Development',
        description: 'Architecting robust database schemas, indexing, complex stored procedures, and analytics queries for Microsoft SQL Server, PostgreSQL, and Supabase.',
        icon: 'FaDatabase',
      },
      {
        title: 'API Integration',
        description: 'Connecting third-party systems like Razorpay payment gateways, Shiprocket logistics APIs, SMS/Email microservices, and Webhooks integrations.',
        icon: 'FaPlug',
      },
      {
        title: 'Full Stack Development',
        description: 'Delivering end-to-end products from databases and API servers to high-fidelity responsive user interfaces in React.',
        icon: 'FaLaptopCode',
      },
    ];
    const { error: serviceError } = await supabase.from('services').insert(servicesData);
    if (serviceError) console.warn('Warning on services insert:', serviceError.message);
    else console.log(`✓ ${servicesData.length} services seeded successfully.`);

    console.log('\n=========================================================');
    console.log('🎉 ALL SUPABASE TABLES SUCCESSFULLY INITIALIZED AND SEEDED!');
    console.log('=========================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Supabase Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedSupabaseDatabase();
