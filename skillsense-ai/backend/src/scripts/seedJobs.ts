// backend/src/scripts/seedJobs.ts
// Run: npx ts-node -r tsconfig-paths/register src/scripts/seedJobs.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JOBS = [
  {
    title: 'Frontend Developer (React)',
    company: 'SkillSense AI',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹8,00,000 - ₹12,00,000 PA',
    description: 'We are looking for a talented Frontend Developer to build beautiful and intuitive user interfaces using React and Tailwind CSS.',
    requirements: ['3+ years of React experience', 'Proficiency in TypeScript', 'Strong CSS skills', 'Knowledge of Next.js is a plus'],
    category: 'Web Development',
  },
  {
    title: 'Backend Engineer (Node/Express)',
    company: 'TechFlow Systems',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹10,00,000 - ₹15,00,000 PA',
    description: 'Join our backend team to build scalable APIs and microservices. You will work with Node.js, Express, and MongoDB.',
    requirements: ['Experience with Node.js and Express', 'Strong MongoDB/Mongoose skills', 'Understanding of RESTful APIs', 'Experience with Docker'],
    category: 'Web Development',
  },
  {
    title: 'Data Scientist (Machine Learning)',
    company: 'DataGenic Inc.',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹12,00,000 - ₹18,00,000 PA',
    description: 'Analyze large datasets and build predictive models to solve complex business problems.',
    requirements: ['Strong Python skills (NumPy, Pandas, Scikit-learn)', 'Experience with NLP and Deep Learning', 'Familiarity with SQL', 'Masters/PhD in related field is preferred'],
    category: 'Data Science',
  },
  {
    title: 'Mobile App Developer (Flutter)',
    company: 'AppVerse Solutions',
    location: 'Mumbai, India',
    type: 'Contract',
    salary: '₹5,000 - ₹8,000 per day',
    description: 'Build cross-platform mobile applications for iOS and Android using Flutter.',
    requirements: ['Experience with Flutter and Dart', 'Knowlege of State Management (Provider, Bloc)', 'API integration experience', 'UI/UX design sensibility'],
    category: 'Mobile Development',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudScale Ops',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹14,00,000 - ₹20,00,000 PA',
    description: 'Manage our cloud infrastructure and automate CI/CD pipelines.',
    requirements: ['Expertise in AWS/Azure/GCP', 'Experience with Kubernetes', 'Proficiency in Terraform', 'Knowledge of Jenkins or GitHub Actions'],
    category: 'DevOps',
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Remote',
    type: 'Part-time',
    salary: '₹40,000 - ₹60,000 PM',
    description: 'Design stunning user experiences and interfaces for our web and mobile applications.',
    requirements: ['Proficiency in Figma', 'Strong portfolio of UI designs', 'Knowledge of Accessibility standards', 'Basic HTML/CSS understanding'],
    category: 'Design',
  },
  {
    title: 'Full Stack Intern',
    company: 'InnovateX Startup',
    location: 'Chennai, India',
    type: 'Internship',
    salary: '₹15,000 - ₹25,000 PM',
    description: 'Learn and contribute across the entire stack. Get hands-on experience with modern web technologies.',
    requirements: ['Basic Web Dev knowledge', 'Enthusiasm to learn', 'Good problem-solving skills', 'Ongoing degree in Computer Science'],
    category: 'Web Development',
  },
  {
    title: 'Senior Data Analyst',
    company: 'Insightful Data',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹15,00,000 - ₹22,00,000 PA',
    description: 'Lead our data analysis efforts to drive strategic decisions.',
    requirements: ['Advanced SQL and Python', 'Experience with Tableau or Power BI', 'Strong communication skills', '5+ years of experience'],
    category: 'Data Science',
  },
  {
    title: 'iOS Developer (Swift)',
    company: 'Apple-Centric Dev',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: '₹10,00,000 - ₹16,00,000 PA',
    description: 'Create native iOS applications using Swift and SwiftUI.',
    requirements: ['Strong Swift and SwiftUI skills', 'Experience with Core Data or Realm', 'Knowledge of App Store submission process', 'Xcode proficiency'],
    category: 'Mobile Development',
  },
  {
    title: 'Site Reliability Engineer',
    company: 'Reliable Systems',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹18,00,000 - ₹25,00,000 PA',
    description: 'Ensure the reliability and performance of our global-scale systems.',
    requirements: ['SRE principles knowledge', 'Programming skills in Python or Go', 'Linux systems expertise', 'Monitoring and alerting setup experience'],
    category: 'DevOps',
  },
  {
    title: 'Motion Graphics Designer',
    company: 'Pixel Perfect',
    location: 'Hyderabad, India',
    type: 'Contract',
    salary: '₹60,000 - ₹90,000 per project',
    description: 'Create engaging motion graphics for our marketing campaigns.',
    requirements: ['Expertise in After Effects', 'Strong sense of timing and animation', 'Proficiency in Illustrator', 'Creative thinking'],
    category: 'Design',
  },
  {
    title: 'React Native Developer',
    company: 'Mobile First',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹9,00,000 - ₹14,00,000 PA',
    description: 'Develop high-performance mobile apps using React Native.',
    requirements: ['React Native experience', 'JavaScript/ES6 expertise', 'Mobile UI component libraries knowldege', 'Experience with native modules'],
    category: 'Mobile Development',
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Future AI',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹15,00,000 - ₹22,00,000 PA',
    description: 'Develop and deploy machine learning models in production environments.',
    requirements: ['Deep Learning frameworks (PyTorch, TensorFlow)', 'MLOps experience', 'C++ or Python proficiency', 'Strong mathematical background'],
    category: 'Data Science',
  },
  {
    title: 'Node.js Developer (Middle)',
    company: 'Startup Hub',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹7,00,000 - ₹10,00,000 PA',
    description: 'Design and develop server-side logic and integrate frontend components.',
    requirements: ['Solid Node.js experience', 'Knowledge of asynchronous programming', 'Redis and Socket.io exposure', 'Unit testing experience'],
    category: 'Web Development',
  },
  {
    title: 'Product Designer',
    company: 'UserFirst SaaS',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹12,00,000 - ₹18,00,000 PA',
    description: 'Take ownership of the product design process from research to high-fidelity mockups.',
    requirements: ['Comprehensive UX process knowledge', 'Strong Figma skills', 'User interviewing experience', 'Ability to collaborate with engineers'],
    category: 'Design',
  }
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Job = (await import('../models/Job.model')).default;

    // Optional: Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    await Job.insertMany(JOBS);
    console.log(`\n🎉 Seed complete! Created: ${JOBS.length} jobs.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
