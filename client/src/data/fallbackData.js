export const fallbackData = {
  profile: {
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
  },
  skills: [
    { name: 'C++', category: 'Backend', level: 'Advanced' },
    { name: 'C#', category: 'Backend', level: 'Advanced' },
    { name: 'HTML5', category: 'Frontend', level: 'Advanced' },
    { name: 'CSS3', category: 'Frontend', level: 'Advanced' },
    { name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
    { name: 'Angular', category: 'Frontend', level: 'Intermediate' },
    { name: 'Bootstrap', category: 'Frontend', level: 'Advanced' },
    { name: 'jQuery', category: 'Frontend', level: 'Intermediate' },
    { name: 'ASP.NET', category: 'Backend', level: 'Advanced' },
    { name: 'MVC', category: 'Backend', level: 'Advanced' },
    { name: 'ASP.Net Web Api', category: 'Backend', level: 'Advanced' },
    { name: 'Microsoft SQL server', category: 'Database', level: 'Advanced' },
    { name: 'Visual Studio', category: 'Tools', level: 'Advanced' },
    { name: 'Git', category: 'Tools', level: 'Advanced' },
    { name: 'GitHub', category: 'Tools', level: 'Advanced' },
  ],
  projects: [
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
  ],
  experiences: [
    {
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
    }
  ],
  educations: [
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
  ],
  certifications: [
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
  ],
  services: [
    {
      title: 'Web Development',
      description: 'Crafting responsive, high-performance, and visually stunning web applications tailored to business requirements.',
      icon: 'FaCode',
    },
    {
      title: 'Backend Development',
      description: 'Designing secure, scalable APIs and background processing systems in C# ASP.NET MVC/Web API.',
      icon: 'FaServer',
    },
    {
      title: 'Database Development',
      description: 'Architecting robust database schemas and queries for Microsoft SQL Server.',
      icon: 'FaDatabase',
    }
  ]
};
