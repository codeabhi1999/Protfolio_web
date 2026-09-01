import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load models
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Service from '../models/Service.js';
import ContactMessage from '../models/ContactMessage.js';

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    console.log(`Connecting to database at ${mongoUri} for seeding...`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Clear existing data
    console.log('Wiping database collections...');
    await User.deleteMany();
    await Profile.deleteMany();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Experience.deleteMany();
    await Education.deleteMany();
    await Certification.deleteMany();
    await Service.deleteMany();
    await ContactMessage.deleteMany();
    console.log('Database wiped.');

    // 1. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    
    console.log(`Creating Admin User: ${adminEmail}`);
    await User.create({
      email: adminEmail,
      password: adminPassword,
    });

    // 2. Create Profile Data
    console.log('Creating Profile Data...');
    await Profile.create({
      name: 'Abhijeet Chavan',
      role: '.NET Developer',
      title: '.NET Developer',
      bio: '.NET Developer with 1.8 years of experience in designing, developing, and deploying web applications using ASP.NET, MVC, C#, SQL Server, and frontend technologies like HTML5, CSS3, JavaScript, and Bootstrap Angular. Hands-on experience in Web API development. Proficient in building responsive user interfaces, optimizing database performance. Adept at collaborating with cross-functional teams to deliver scalable and efficient solutions. Passionate about leveraging technical expertise to drive organizational success and enhance user experiences.',
      location: 'Nagpur, Maharashtra, INDIA',
      email: 'chavanabhijeet95@gmail.com',
      phone: '7057731248',
      profileImage: '/uploads/profile_placeholder.jpg',
      resumeUrl: '/uploads/resume_placeholder.pdf',
      socialLinks: {
        github: 'https://github.com/abhijeetchavan',
        linkedin: 'https://linkedin.com/in/abhijeetchavan',
        instagram: 'https://instagram.com/abhijeetchavan',
      },
    });

    // 3. Create Skills
    console.log('Creating Skills...');
    const skillsData = [
      // Programming Languages
      { name: 'C++', category: 'Backend', level: 'Advanced' },
      { name: 'C#', category: 'Backend', level: 'Advanced' },

      // Frontend
      { name: 'HTML5', category: 'Frontend', level: 'Advanced' },
      { name: 'CSS3', category: 'Frontend', level: 'Advanced' },
      { name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
      { name: 'Angular', category: 'Frontend', level: 'Intermediate' },
      { name: 'Bootstrap', category: 'Frontend', level: 'Advanced' },
      { name: 'jQuery', category: 'Frontend', level: 'Intermediate' },

      // Backend
      { name: 'ASP.NET', category: 'Backend', level: 'Advanced' },
      { name: 'MVC', category: 'Backend', level: 'Advanced' },
      { name: 'ASP.Net Web Api', category: 'Backend', level: 'Advanced' },

      // Database
      { name: 'Microsoft SQL server', category: 'Database', level: 'Advanced' },

      // Tools
      { name: 'Visual Studio', category: 'Tools', level: 'Advanced' },
      { name: 'Git', category: 'Tools', level: 'Advanced' },
      { name: 'GitHub', category: 'Tools', level: 'Advanced' },
    ];
    await Skill.insertMany(skillsData);

    // 4. Create Projects
    console.log('Creating Projects...');
    const projectsData = [
      {
        title: 'E-commerce Web Application',
        description: 'Developed a full-stack E-commerce Web Application with product catalog, shopping cart, and order management.',
        detailedDescription: 'Developed a full-stack E-commerce Web Application with product catalog, shopping cart, and order management. Implemented secure user authentication (login, registration, profile management). Integrated Razorpay for payments and Shiprocket for shipping & tracking. Built with ASP.NET, C#, SQL Server, HTML, CSS, JavaScript for robust backend and responsive UI.',
        technologies: ['ASP.NET', 'C#', 'SQL Server', 'HTML', 'CSS', 'JavaScript', 'Razorpay', 'Shiprocket'],
        category: '.NET',
        featured: true,
        githubUrl: '',
        liveUrl: '',
        image: '',
      },
      {
        title: 'HMIS',
        description: 'Developed a Duty Assignment Module for hospital staff with ward-wise duty allocation.',
        detailedDescription: 'Developed a Duty Assignment Module for hospital staff with ward-wise duty allocation. Enabled scheduling by ward number, timing, and assigned doctor/staff.',
        technologies: ['C#', 'ASP.NET', 'SQL Server', 'JavaScript', 'HTML', 'CSS'],
        category: '.NET',
        featured: true,
        githubUrl: '',
        liveUrl: '',
        image: '',
      },
    ];
    await Project.insertMany(projectsData);

    // 5. Create Experience
    console.log('Creating Experience...');
    await Experience.create({
      company: 'Global IT Services and Solutions',
      position: 'Dot Net Developer',
      startDate: '09/2023',
      endDate: 'Present',
      location: 'Nagpur, Maharashtra, INDIA',
      responsibilities: [
        'Developed user-friendly interfaces for the LISEP ICU Management System.',
        'Built responsive web pages using HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.',
        'Created a duty scheduling module for HMIS, managing shifts and patient assignments.',
        'Currently building a company website with enhanced UI and animations.',
        'I have worked on-site at Yavatmal Vasantrao Naik Hospital.',
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS'],
      achievements: [],
    });

    // 6. Create Education
    console.log('Creating Education...');
    await Education.insertMany([
      {
        degree: 'Master of Computer Applications',
        institution: 'Prof. Ram Meghe Institute of Technology & Research Badnera Rly.',
        startYear: '2020',
        endYear: '2022',
        description: '9.0 CGPA. Location: Amravati, India.',
      },
      {
        degree: 'Bachelor of Computer Application',
        institution: 'Vidya Bhavan College of Management and Research',
        startYear: '2017',
        endYear: '2020',
        description: '7.2 CGPA. Location: Yavatmal, India.',
      }
    ]);

    // 7. Create Services
    console.log('Creating Services...');
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
        description: 'Architecting robust database schemas, indexing, complex stored procedures, and analytics queries for Microsoft SQL Server, MySQL, and MongoDB.',
        icon: 'FaDatabase',
      },
      {
        title: 'API Integration',
        description: 'Connecting third-party systems like Razorpay payment gateways, Shiprocket logistics APIs, SMS/Email microservices, and Webhooks integrations.',
        icon: 'FaPlug',
      },
      {
        title: 'Full Stack Development',
        description: 'Delivering end-to-end products from databases and API servers to high-fidelity user-friendly responsive user interfaces in React.',
        icon: 'FaLaptopCode',
      },
    ];
    await Service.insertMany(servicesData);

    // 8. Create Certification Placeholder
    console.log('Creating Certification Placeholder...');
    await Certification.insertMany([
      {
        name: 'Responsive web Design',
        issuingOrganization: 'freeCodeCamp',
        date: '',
        credentialId: '',
        credentialUrl: '',
        image: '',
      },
      {
        name: 'ESG Virtual Experience Program',
        issuingOrganization: '',
        date: '',
        credentialId: '',
        credentialUrl: '',
        image: '',
      }
    ]);

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
