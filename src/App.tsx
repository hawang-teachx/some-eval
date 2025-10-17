import React from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface Skill {
  category: string;
  items: string[];
}

function App() {
  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce application with payment integration, inventory management, and admin dashboard. Features include product search, filtering, cart management, and order tracking.",
      tech: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates using WebSockets. Includes team workspaces, task assignments, deadlines, and progress tracking with Kanban boards.",
      tech: ["TypeScript", "Firebase", "Tailwind CSS", "React Query"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with 7-day forecasts, interactive maps, and location search. Visualizes temperature trends, precipitation data, and air quality indices.",
      tech: ["React", "OpenWeather API", "Chart.js", "Leaflet"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 4,
      title: "Social Media Analytics Tool",
      description: "Analytics platform for tracking social media performance across multiple platforms. Provides insights on engagement, growth metrics, and content performance with exportable reports.",
      tech: ["Next.js", "PostgreSQL", "Prisma", "D3.js"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 5,
      title: "Recipe Sharing Platform",
      description: "Community-driven recipe sharing platform where users can post recipes, rate dishes, and save favorites. Includes ingredient scaling, meal planning, and grocery list generation.",
      tech: ["React", "Express", "MongoDB", "AWS S3", "JWT"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 6,
      title: "Portfolio Builder",
      description: "Drag-and-drop portfolio website builder with customizable templates. Users can create professional portfolios without coding, with built-in SEO optimization and analytics.",
      tech: ["Vue.js", "Node.js", "MySQL", "Docker"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 7,
      title: "Real Estate Listing Platform",
      description: "Property listing website with advanced search filters, virtual tours, and map integration. Features agent profiles, mortgage calculators, and appointment scheduling.",
      tech: ["Next.js", "TypeScript", "Mapbox", "Stripe", "Cloudinary"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 8,
      title: "Fitness Tracker App",
      description: "Personal fitness tracking application with workout logging, progress charts, and meal planning. Integrates with wearable devices and provides personalized workout recommendations.",
      tech: ["React Native", "Node.js", "PostgreSQL", "Redux"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 9,
      title: "Blog CMS Platform",
      description: "Custom content management system for bloggers with markdown support, SEO tools, and analytics. Includes comment moderation, scheduling, and multi-author support.",
      tech: ["React", "GraphQL", "Node.js", "PostgreSQL", "Redis"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 10,
      title: "Video Streaming Service",
      description: "Netflix-style video streaming platform with user authentication, video encoding, and adaptive bitrate streaming. Features playlists, recommendations, and watch history.",
      tech: ["React", "AWS S3", "Lambda", "DynamoDB", "HLS"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 11,
      title: "Chat Application",
      description: "Real-time chat application with private messaging, group chats, and file sharing. Supports emoji reactions, message editing, and read receipts with end-to-end encryption.",
      tech: ["React", "Socket.io", "Node.js", "MongoDB", "WebRTC"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      id: 12,
      title: "Booking Management System",
      description: "Appointment booking system for service businesses with calendar integration, automated reminders, and payment processing. Includes customer management and analytics dashboard.",
      tech: ["Vue.js", "Express", "MySQL", "SendGrid", "Stripe"],
      link: "https://example.com",
      github: "https://github.com/example"
    }
  ];

  const experience: Experience[] = [
    {
      company: "Tech Solutions Inc.",
      role: "Senior Frontend Developer",
      period: "2022 - Present",
      description: "Lead development of customer-facing web applications using React and TypeScript. Mentored junior developers and established coding standards. Improved application performance by 40% through optimization."
    },
    {
      company: "Digital Innovations",
      role: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Built and maintained multiple client projects using modern web technologies. Collaborated with designers and product managers to deliver high-quality solutions. Implemented CI/CD pipelines reducing deployment time by 60%."
    },
    {
      company: "StartupHub",
      role: "Junior Web Developer",
      period: "2018 - 2020",
      description: "Developed responsive websites and web applications. Worked on both frontend and backend features. Participated in code reviews and agile development processes."
    }
  ];

  const skills: Skill[] = [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "JavaScript (ES6+)", "Next.js", "Vue.js", "HTML5/CSS3", "Tailwind CSS", "SASS", "Redux", "React Query"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "MySQL", "REST APIs", "GraphQL", "Redis", "JWT Authentication"]
    },
    {
      category: "Tools & DevOps",
      items: ["Git", "Docker", "AWS", "CI/CD", "Webpack", "Vite", "Jest", "Testing Library", "Figma", "Postman"]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE4B5', fontFamily: 'Comic Sans MS, cursive' }}>
      <header className="p-2 border-b-8" style={{ backgroundColor: '#FF69B4', borderColor: '#00FF00' }}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-6xl font-bold" style={{ color: '#FF0000', textShadow: '3px 3px 0px #0000FF' }}>John Doe</div>
          <ul className="flex gap-2">
            <li><a href="#about" style={{ color: '#00FF00', fontSize: '24px' }}>About</a></li>
            <li><a href="#experience" style={{ color: '#FF00FF', fontSize: '12px' }}>Experience</a></li>
            <li><a href="#projects" style={{ color: '#FFFF00', fontSize: '18px' }}>Projects</a></li>
            <li><a href="#skills" style={{ color: '#00FFFF', fontSize: '28px' }}>Skills</a></li>
            <li><a href="#contact" style={{ color: '#FFA500', fontSize: '14px' }}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="py-2 px-1" style={{ backgroundColor: '#00CED1' }}>
          <div className="max-w-6xl mx-auto" style={{ textAlign: 'right' }}>
            <h1 className="text-5xl font-bold mb-1" style={{ color: '#FF1493', transform: 'rotate(-5deg)' }}>Full Stack Web Developer</h1>
            <p className="text-xl mb-1" style={{ color: '#000000', letterSpacing: '10px' }}>Building modern, scalable web applications with clean code and exceptional user experiences.</p>
            <p className="text-lg mb-2" style={{ color: '#FFFFFF', backgroundColor: '#000000', display: 'inline-block', padding: '5px' }}>Specializing in React, TypeScript, and Node.js</p>
            <div className="flex gap-1 justify-end">
              <button className="px-2 py-1 border-4" style={{ backgroundColor: '#FF0000', color: '#FFFF00', fontSize: '24px', borderColor: '#0000FF', borderRadius: '50%' }}>View My Work</button>
              <button className="px-2 py-1 border-4" style={{ backgroundColor: '#00FF00', color: '#FF00FF', fontSize: '10px', borderColor: '#FF0000', transform: 'skew(-10deg)' }}>Download Resume</button>
            </div>
          </div>
        </section>

        <section id="about" className="py-3 px-12 border-t-4" style={{ backgroundColor: '#FFFFE0', borderColor: '#8B4513' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#4B0082', textDecoration: 'underline wavy' }}>About Me</h2>
            <div className="space-y-1" style={{ lineHeight: '2.5' }}>
              <p style={{ color: '#FF4500', fontSize: '18px', fontWeight: 'bold' }}>
                I'm a passionate full-stack web developer with over 6 years of experience creating responsive, 
                accessible, and user-friendly applications. I specialize in modern JavaScript frameworks and have 
                a strong foundation in both frontend and backend development.
              </p>
              <p style={{ color: '#008000', fontSize: '12px', fontStyle: 'italic' }}>
                My journey into web development started with a curiosity about how websites work, which quickly 
                evolved into a deep passion for creating digital experiences. I love the challenge of solving 
                complex problems and the satisfaction of seeing users benefit from well-crafted applications.
              </p>
              <p style={{ color: '#0000FF', fontSize: '22px', textAlign: 'center' }}>
                I'm particularly interested in performance optimization, clean architecture, and creating 
                accessible web applications that everyone can use. I believe in writing maintainable code 
                and following best practices to ensure long-term project success.
              </p>
              <p style={{ color: '#FF1493', fontSize: '14px', textAlign: 'right', letterSpacing: '5px' }}>
                When I'm not coding, you can find me contributing to open-source projects, writing technical 
                articles on web development, attending tech meetups, or exploring new frameworks and tools. 
                I'm also an advocate for continuous learning and regularly participate in online courses and 
                coding challenges to stay current with industry trends.
              </p>
            </div>
          </div>
        </section>

        <section id="experience" className="py-40 px-2 border-t-8" style={{ backgroundColor: '#FFC0CB', borderColor: '#800080' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-1" style={{ color: '#228B22', textAlign: 'center', textTransform: 'uppercase' }}>Experience</h2>
            <div className="space-y-1">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-8 pl-1" style={{ borderColor: index % 2 === 0 ? '#FF0000' : '#0000FF', backgroundColor: index % 2 === 0 ? '#FFFF00' : '#00FFFF' }}>
                  <h3 className="text-xl font-bold" style={{ color: '#FF00FF', fontSize: index === 0 ? '32px' : index === 1 ? '18px' : '14px' }}>{exp.role}</h3>
                  <p className="font-semibold mb-1" style={{ color: '#000000', textDecoration: 'line-through' }}>{exp.company}</p>
                  <p className="text-sm mb-1" style={{ color: '#FF4500' }}>{exp.period}</p>
                  <p style={{ color: '#4B0082', fontSize: '16px', lineHeight: '1.2' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-10 px-20 border-t-4" style={{ backgroundColor: '#98FB98', borderColor: '#DC143C' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#8B0000', transform: 'skew(-15deg)', textAlign: 'right' }}>Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {projects.map(project => (
                <div key={project.id} className="border-8 p-1" style={{ borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, backgroundColor: project.id % 3 === 0 ? '#FFB6C1' : project.id % 3 === 1 ? '#E0FFFF' : '#F0E68C' }}>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#FF0000', fontSize: project.id % 2 === 0 ? '28px' : '16px' }}>{project.title}</h3>
                  <p className="mb-1" style={{ color: '#000080', fontSize: '10px', lineHeight: '3' }}>{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-1 py-1 border-2 text-sm" style={{ backgroundColor: '#FF69B4', color: '#FFFFFF', borderColor: '#000000', borderRadius: '20px', transform: 'rotate(5deg)' }}>{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <a href={project.link} className="underline" style={{ color: '#00FF00', fontSize: '20px', fontWeight: 'bold' }}>Live Demo</a>
                    <a href={project.github} className="underline" style={{ color: '#FF00FF', fontSize: '12px' }}>GitHub</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="py-5 px-1 border-t-8" style={{ backgroundColor: '#FFDAB9', borderColor: '#2F4F4F' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#B22222', textAlign: 'center', letterSpacing: '15px' }}>Skills & Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {skills.map(skill => (
                <div key={skill.category} style={{ backgroundColor: skill.category === 'Frontend' ? '#FFE4E1' : skill.category === 'Backend' ? '#E6E6FA' : '#F5DEB3', padding: '2px', border: '5px dotted #000000' }}>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#FF1493', textAlign: 'center', textTransform: 'lowercase' }}>{skill.category}</h3>
                  <ul className="space-y-0">
                    {skill.items.map(item => (
                      <li key={item} style={{ color: '#006400', fontSize: '14px', marginLeft: '50px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-1 px-32 border-t-8" style={{ backgroundColor: '#DDA0DD', borderColor: '#556B2F' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-1" style={{ color: '#8B4513', textDecoration: 'underline overline', textAlign: 'center' }}>Get In Touch</h2>
            <p className="mb-1" style={{ color: '#000000', fontSize: '22px', lineHeight: '1' }}>
              I'm always open to new opportunities, collaborations, and interesting projects. 
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <p className="mb-2" style={{ color: '#FF0000', fontSize: '10px', textAlign: 'right' }}>
              I typically respond within 24 hours and am available for freelance work, 
              contract positions, and full-time opportunities.
            </p>
            <div className="space-y-0">
              <p style={{ color: '#0000FF', fontSize: '18px' }}><span className="font-semibold">Email:</span> john.doe@example.com</p>
              <p style={{ color: '#FF00FF', fontSize: '14px' }}><span className="font-semibold">Phone:</span> +1 (555) 123-4567</p>
              <p style={{ color: '#00FF00', fontSize: '22px' }}><span className="font-semibold">GitHub:</span> github.com/johndoe</p>
              <p style={{ color: '#FFFF00', fontSize: '12px' }}><span className="font-semibold">LinkedIn:</span> linkedin.com/in/johndoe</p>
              <p style={{ color: '#00FFFF', fontSize: '26px' }}><span className="font-semibold">Twitter:</span> @johndoe_dev</p>
              <p style={{ color: '#FFA500', fontSize: '16px' }}><span className="font-semibold">Location:</span> San Francisco, CA</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-1 px-6 border-t-8 text-center" style={{ backgroundColor: '#2F4F4F', color: '#FFFF00', borderColor: '#FF1493', fontSize: '8px' }}>
        <p>&copy; 2025 John Doe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;