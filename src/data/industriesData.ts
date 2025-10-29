import { Cpu, CircuitBoard, Computer } from 'lucide-react';
import { IndustriesDataType } from '@/types/industry';

// Industry data with detailed information
export const industriesData: IndustriesDataType = {
  'ai-ml': {
    name: 'AI & Machine Learning',
    icon: '🧠',
    color: 'bg-purple-50',
    accentColor: 'bg-purple-600',
    textColor: 'text-purple-700',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    image: '/images/ai.png',
    description: 'Specialized recruitment for artificial intelligence and machine learning roles across research, development, and implementation.',
    longDescription: 'The AI and machine learning sector is experiencing unprecedented growth, with demand for talented professionals far outpacing supply. Our specialized recruiters have deep technical understanding of neural networks, deep learning, computer vision, NLP, and reinforcement learning domains. We connect innovative companies with AI researchers, ML engineers, data scientists, and AI product managers who can turn cutting-edge research into practical applications.',
    keyRoles: [
      'Machine Learning Engineer',
      'AI Research Scientist',
      'Deep Learning Specialist',
      'Computer Vision Engineer',
      'NLP Data Scientist',
      'AI Ethics Specialist',
      'ML Ops Engineer'
    ],
    challenges: [
      'Extreme competition for top talent',
      'Rapidly evolving technical requirements',
      'Balancing theoretical knowledge with practical implementation skills',
      'Finding specialists in emerging AI subfields'
    ],
    stats: [
      '83% of enterprises have adopted AI/ML in some form',
      '71% increase in AI job postings over the past 3 years',
      '$15.7 trillion potential contribution to the global economy by 2030'
    ],
    lucideIcon: Cpu
  },
  'semiconductors': {
    name: 'Semiconductors',
    icon: '🔌',
    color: 'bg-blue-50',
    accentColor: 'bg-blue-600',
    textColor: 'text-blue-700',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    image: '/images/semi.png',
    description: 'Connecting top talent with semiconductor manufacturers, design houses, and equipment suppliers.',
    longDescription: 'The semiconductor industry forms the backbone of modern technology, powering everything from smartphones to data centers to automotive systems. With the global chip shortage highlighting the strategic importance of this sector, companies are investing heavily in expanding production capacity and innovation. Our specialized recruitment services connect semiconductor manufacturers, design houses, and equipment suppliers with engineers and executives who understand the complexities of chip design, fabrication, packaging, and testing.',
    keyRoles: [
      'IC Design Engineer',
      'Process Integration Engineer',
      'Semiconductor Equipment Engineer',
      'FPGA Designer',
      'Verification Engineer',
      'Fab Operations Manager',
      'RF/Analog Circuit Designer'
    ],
    challenges: [
      'Highly specialized technical knowledge requirements',
      'Limited talent pool for advanced process nodes',
      'Complex global supply chain considerations',
      'Balancing cost, performance, and power efficiency'
    ],
    stats: [
      'Global semiconductor market projected to reach $803.2 billion by 2028',
      '200,000+ specialized engineering roles needed in the next decade',
      '7% annual growth rate despite cyclical market dynamics'
    ],
    lucideIcon: Computer
  },
  'automotive': {
    name: 'Automotive',
    icon: '🚗',
    color: 'bg-green-50',
    accentColor: 'bg-green-600',
    textColor: 'text-green-700',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    image: '/images/automotive.png',
    description: 'Recruitment solutions for autonomous vehicles, electric cars, and smart mobility technologies.',
    longDescription: 'The automotive industry is undergoing its most significant transformation since the invention of the assembly line. Electrification, autonomous driving, and connected car technologies are creating entirely new categories of jobs and skill requirements. Our automotive recruitment specialists understand both traditional vehicle engineering and the cutting-edge software, sensors, and AI systems that define modern mobility solutions. We help OEMs, tier suppliers, and mobility startups find the talent they need to navigate this revolutionary transition.',
    keyRoles: [
      'Autonomous Vehicle Engineer',
      'Battery Systems Engineer',
      'Automotive Software Developer',
      'Electric Powertrain Specialist',
      'Vehicle Network Architect',
      'ADAS Calibration Engineer',
      'Automotive Cybersecurity Expert'
    ],
    challenges: [
      'Convergence of automotive and technology skill sets',
      'Rapid evolution of safety and regulatory requirements',
      'Intensive competition from tech giants entering the space',
      'Finding talent with both mechanical and software expertise'
    ],
    stats: [
      '2500% increase in demand for automotive software engineers since 2010',
      'Over $500 billion invested in electric and autonomous vehicle development',
      '30% of all vehicles sold by 2030 expected to be electric'
    ],
    lucideIcon: CircuitBoard
  },
  'battery-tech': {
    name: 'Battery Tech',
    icon: '🔋',
    color: 'bg-amber-50',
    accentColor: 'bg-amber-600',
    textColor: 'text-amber-700',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    image: '/images/battery-pack.png',
    description: 'Finding specialized talent for energy storage development, production, and research.',
    longDescription: 'Battery technology represents one of the most critical innovation areas for enabling the green energy transition. From electric vehicles to grid-scale storage to consumer electronics, advanced battery systems are essential for a sustainable future. Our recruitment teams specialize in connecting battery manufacturers, materials companies, and research institutions with electrochemists, materials scientists, manufacturing engineers, and other specialists who can advance the next generation of energy storage solutions.',
    keyRoles: [
      'Battery Cell Engineer',
      'Energy Storage Researcher',
      'Battery Management System Developer',
      'Materials Scientist',
      'Battery Manufacturing Engineer',
      'Thermal Management Specialist',
      'Battery Testing Engineer'
    ],
    challenges: [
      'Highly specialized expertise in electrochemistry',
      'Balancing performance, cost, and safety requirements',
      'Scaling from laboratory to mass production',
      'Integration with diverse applications from EVs to grid storage'
    ],
    stats: [
      'Battery costs declined 89% from 2010 to 2022',
      '$300+ billion committed to battery gigafactory investments worldwide',
      '3.5x increase in battery energy density projected by 2030'
    ],
    lucideIcon: Cpu
  },
  'web-tech': {
    name: 'Web Tech',
    icon: '🌐',
    color: 'bg-sky-50',
    accentColor: 'bg-sky-600',
    textColor: 'text-sky-700',
    buttonColor: 'bg-sky-600 hover:bg-sky-700',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    description: 'Connecting companies with front-end, back-end, and full-stack developers across all modern frameworks.',
    longDescription: 'Web technologies continue to evolve at a rapid pace, with new frameworks, architectures, and methodologies emerging constantly. From responsive front-end design to scalable cloud-native backends, companies need specialized talent to build modern digital experiences. Our web tech recruiters stay at the forefront of trends like JAMstack, serverless architectures, and AI-enhanced development to help companies build engineering teams that can deliver exceptional web applications.',
    keyRoles: [
      'Front-End Developer',
      'Back-End Engineer',
      'Full-Stack Developer',
      'UI/UX Designer',
      'DevOps Engineer',
      'Web Performance Specialist',
      'Accessibility Engineer'
    ],
    challenges: [
      'Rapidly evolving framework ecosystem',
      'Finding developers with both technical skills and user experience focus',
      'Balancing innovation with maintainability',
      'Remote work and distributed team considerations'
    ],
    stats: [
      'Over 60% of web traffic now comes from mobile devices',
      '1.13 billion websites active worldwide requiring ongoing development',
      '33% faster development cycles with modern web frameworks'
    ],
    lucideIcon: Cpu
  },
  'embedded-systems': {
    name: 'Embedded Systems',
    icon: '💻',
    color: 'bg-gray-100',
    accentColor: 'bg-gray-700',
    textColor: 'text-gray-800',
    buttonColor: 'bg-gray-700 hover:bg-gray-800',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: 'Recruiting embedded software and hardware engineers for IoT, consumer electronics, and industrial applications.',
    longDescription: 'Embedded systems are the invisible computers that power our world, from household appliances to industrial machinery to medical devices. As these systems become increasingly sophisticated and connected through IoT, the demand for specialized engineering talent continues to grow. Our embedded systems recruiters understand the unique challenges of resource-constrained computing environments and help companies find engineers who can optimize for performance, reliability, and power efficiency while meeting strict regulatory requirements.',
    keyRoles: [
      'Embedded Software Engineer',
      'Firmware Developer',
      'RTOS Specialist',
      'Hardware Design Engineer',
      'Embedded Security Expert',
      'IoT System Architect',
      'Embedded Linux Developer'
    ],
    challenges: [
      'Real-time performance requirements',
      'Hardware-software co-design complexity',
      'Long product lifecycles and maintenance considerations',
      'Safety-critical system certification'
    ],
    stats: [
      '24.9 billion IoT devices expected by 2030, all requiring embedded software',
      '35% of embedded developers now working on AI/ML integration',
      '$198 billion market size for embedded systems by 2025'
    ],
    lucideIcon: Computer
  },
  'blockchain': {
    name: 'Blockchain & Crypto',
    icon: '⛓️',
    color: 'bg-orange-50',
    accentColor: 'bg-orange-600',
    textColor: 'text-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    description: 'Talent acquisition for blockchain platforms, cryptocurrency exchanges, and decentralized applications.',
    longDescription: 'Blockchain technology has evolved far beyond cryptocurrencies, with applications spanning decentralized finance (DeFi), supply chain tracking, digital identity, and more. The distributed, secure, and transparent nature of blockchain creates unique technical challenges and opportunities. Our blockchain recruitment specialists understand both the core cryptographic principles and the emerging ecosystem of smart contracts, consensus mechanisms, and tokenomics to help companies build teams that can develop and deploy innovative distributed ledger solutions.',
    keyRoles: [
      'Blockchain Developer',
      'Smart Contract Engineer',
      'Cryptography Specialist',
      'DeFi Protocol Designer',
      'Consensus Algorithm Developer',
      'Tokenomics Expert',
      'Blockchain Security Auditor'
    ],
    challenges: [
      'Rapidly evolving regulatory landscape',
      'Balancing decentralization with performance and usability',
      'Integration with existing financial and enterprise systems',
      'Specialized security requirements for immutable systems'
    ],
    stats: [
      'Blockchain market size expected to reach $163 billion by 2029',
      '81% of large companies considering or deploying blockchain solutions',
      '67% talent gap in qualified blockchain developers'
    ],
    lucideIcon: Cpu
  },
  'wireless-iot': {
    name: 'Wireless & IoT',
    icon: '📶',
    color: 'bg-teal-50',
    accentColor: 'bg-teal-600',
    textColor: 'text-teal-700',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
    image: '/images/wireless-charging.png',
    description: 'Recruiting for roles in wireless communication, IoT infrastructure, and connected devices.',
    longDescription: 'Wireless technologies and the Internet of Things (IoT) are transforming how we interact with the physical world, creating networks of billions of connected devices that generate and process vast amounts of data. From 5G networks to low-power wide-area networks to mesh protocols, the wireless landscape continues to evolve. Our recruiters specialize in finding RF engineers, embedded systems developers, and IoT solutions architects who can design and deploy reliable connected systems across consumer, industrial, agricultural, and smart city applications.',
    keyRoles: [
      'RF Engineer',
      'Wireless Protocol Developer',
      'IoT Solution Architect',
      'Edge Computing Specialist',
      'Embedded Systems Engineer',
      'Wireless Network Planner',
      'IoT Data Analyst'
    ],
    challenges: [
      'Power constraints for battery-operated devices',
      'Scalability for massive IoT deployments',
      'Interoperability across diverse protocols and standards',
      'Security for resource-constrained devices'
    ],
    stats: [
      'Over 41 billion IoT devices expected to be in use by 2027',
      '70% of industrial companies implementing IoT solutions',
      '$2.4 trillion in global IoT spending projected by 2027'
    ],
    lucideIcon: CircuitBoard
  },
  'cloud-computing': {
    name: 'Cloud Computing',
    icon: '☁️',
    color: 'bg-indigo-50',
    accentColor: 'bg-indigo-600',
    textColor: 'text-indigo-700',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    image: '/images/cloud-computing.png',
    description: 'Finding skilled professionals in cloud architecture, DevOps, and platform engineering.',
    longDescription: 'Cloud computing has fundamentally transformed how organizations build, deploy, and scale applications and services. From infrastructure-as-a-service to serverless architectures, the cloud enables unprecedented flexibility and efficiency. Our cloud recruitment specialists understand the unique requirements of major platforms like AWS, Azure, and Google Cloud, as well as multi-cloud strategies, helping companies find architects, engineers, and specialists who can design resilient, cost-effective, and secure cloud environments.',
    keyRoles: [
      'Cloud Solutions Architect',
      'DevOps Engineer',
      'Site Reliability Engineer (SRE)',
      'Cloud Security Specialist',
      'Kubernetes Administrator',
      'Serverless Developer',
      'Cloud Financial Analyst'
    ],
    challenges: [
      'Optimizing for both performance and cost',
      'Ensuring security and compliance in shared infrastructure',
      'Managing multi-cloud and hybrid cloud environments',
      'Keeping pace with rapidly evolving cloud services'
    ],
    stats: [
      '94% of enterprises use cloud services in some capacity',
      '$1.3 trillion in IT spending shifting to cloud technologies by 2025',
      '40% annual growth in containerized application deployment'
    ],
    lucideIcon: Cpu
  },
  'gaming-ar-vr': {
    name: 'Gaming AR/VR',
    icon: '🎮',
    color: 'bg-violet-50',
    accentColor: 'bg-violet-600',
    textColor: 'text-violet-700',
    buttonColor: 'bg-violet-600 hover:bg-violet-700',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    description: 'Specialized recruitment for game development, augmented reality, and virtual reality technologies.',
    longDescription: 'Gaming, augmented reality, and virtual reality are at the forefront of immersive digital experiences, transforming entertainment, education, training, and collaboration. As XR technologies become more sophisticated and accessible, companies need specialized talent who understand both the technical aspects of 3D rendering, spatial computing, and interaction design, as well as the creative elements that make immersive experiences compelling. Our gaming and XR recruiters help studios and tech companies build teams that can push the boundaries of what is possible in virtual worlds.',
    keyRoles: [
      'Game Developer',
      'XR/AR/VR Engineer',
      '3D Technical Artist',
      'Spatial Computing Specialist',
      'Unity/Unreal Engine Developer',
      'XR UX Designer',
      'Graphics Programmer'
    ],
    challenges: [
      'Performance optimization for immersive experiences',
      'Creating intuitive interactions in 3D space',
      'Cross-platform development across diverse hardware',
      'Balancing technical constraints with creative vision'
    ],
    stats: [
      '$296 billion global gaming market size in 2022',
      '171% growth in AR/VR job postings over the past two years',
      '23.5 million AR/VR headsets shipped annually by 2025'
    ],
    lucideIcon: CircuitBoard
  },
  'engineering': {
    name: 'Engineering',
    icon: '⚙️',
    color: 'bg-stone-50',
    accentColor: 'bg-stone-600',
    textColor: 'text-stone-700',
    buttonColor: 'bg-stone-600 hover:bg-stone-700',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: 'Connecting companies with mechanical, electrical, and systems engineers across multiple industries.',
    longDescription: 'Engineering disciplines form the backbone of technological innovation, from mechanical systems to electrical designs to integrated hardware-software products. Our engineering recruitment practice spans traditional disciplines like mechanical, electrical, and civil engineering as well as emerging interdisciplinary fields. We help companies across manufacturing, aerospace, energy, and consumer products find engineers who combine deep technical expertise with practical problem-solving abilities to develop the products and systems that shape our world.',
    keyRoles: [
      'Mechanical Engineer',
      'Electrical Engineer',
      'Civil Engineer',
      'Systems Engineer',
      'Robotics Engineer',
      'Mechatronics Specialist',
      'Acoustics Engineer'
    ],
    challenges: [
      'Integrating digital technologies with physical systems',
      'Optimizing designs for sustainability and efficiency',
      'Managing complex, multidisciplinary projects',
      'Balancing innovation with reliability and safety'
    ],
    stats: [
      'Over 40% of engineering roles now require software knowledge',
      '$12.7 trillion annual economic output from engineering industries',
      '16% projected growth in advanced engineering roles by 2030'
    ],
    lucideIcon: Computer
  },
  'life-science': {
    name: 'Life Science',
    icon: '🧬',
    color: 'bg-emerald-50',
    accentColor: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    description: 'Talent solutions for biotech, medical technology, and pharmaceutical technology roles.',
    longDescription: 'Life sciences technology sits at the intersection of biology, medicine, and computational methods, enabling breakthroughs in drug discovery, diagnostics, personalized medicine, and biomedical devices. Our life sciences recruitment team specializes in connecting biotechnology companies, pharmaceutical firms, medical device manufacturers, and research institutions with scientists, engineers, and technical specialists who can advance innovations from laboratory discovery to commercial products that improve patient outcomes and transform healthcare delivery.',
    keyRoles: [
      'Bioinformatics Scientist',
      'Computational Biologist',
      'Medical Device Engineer',
      'Clinical Data Analyst',
      'Genomics Researcher',
      'Biomedical Software Developer',
      'Regulatory Affairs Specialist'
    ],
    challenges: [
      'Stringent regulatory requirements and compliance',
      'Long development cycles from research to market',
      'Integration of biology expertise with computational methods',
      'Data privacy and ethics considerations'
    ],
    stats: [
      '$2.4 trillion global life sciences market',
      '38% increase in computational biology roles in 5 years',
      '74% of biotech companies reporting talent shortages'
    ],
    lucideIcon: Cpu
  },
  'cyber-security': {
    name: 'Cyber Security',
    icon: '🔒',
    color: 'bg-red-50',
    accentColor: 'bg-red-600',
    textColor: 'text-red-700',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    image: '/images/cyber-security.png',
    description: 'Recruiting information security specialists, ethical hackers, and security architects.',
    longDescription: 'Cybersecurity has become a critical priority for organizations of all sizes as digital transformation increases attack surfaces and sophisticated threats continue to evolve. From protecting critical infrastructure to securing cloud environments to ensuring data privacy, the demand for security expertise far outpaces supply. Our cybersecurity recruitment specialists help companies build robust security teams with the technical skills, threat intelligence, and risk management expertise needed to protect systems, data, and operations from increasingly complex cyber threats.',
    keyRoles: [
      'Security Engineer',
      'Penetration Tester',
      'Security Architect',
      'Security Operations Analyst',
      'Threat Intelligence Specialist',
      'Cloud Security Engineer',
      'Security Compliance Manager'
    ],
    challenges: [
      'Rapidly evolving threat landscape',
      'Global shortage of qualified cybersecurity professionals',
      'Balancing security with usability and business efficiency',
      'Securing increasingly complex hybrid environments'
    ],
    stats: [
      '3.5 million unfilled cybersecurity positions globally',
      '$10.5 trillion annual cost of cybercrime by 2025',
      '68% of business leaders feeling their cybersecurity risks are increasing'
    ],
    lucideIcon: CircuitBoard
  },
  'data-science': {
    name: 'Data Science',
    icon: '📊',
    color: 'bg-cyan-50',
    accentColor: 'bg-cyan-600',
    textColor: 'text-cyan-700',
    buttonColor: 'bg-cyan-600 hover:bg-cyan-700',
    image: '/images/data-science.png',
    description: 'Finding data scientists, analysts, and engineers to help companies leverage their data assets.',
    longDescription: 'Data science and analytics have become essential capabilities for organizations seeking to derive actionable insights from the vast amounts of data they generate and collect. From predictive models to data visualization to large-scale data engineering, companies across industries need specialists who can transform raw data into business value. Our data science recruitment team specializes in connecting organizations with professionals who combine statistical knowledge, programming skills, and business acumen to build data products and solutions that drive strategic decision-making and operational excellence.',
    keyRoles: [
      'Data Scientist',
      'Machine Learning Engineer',
      'Data Engineer',
      'Business Intelligence Analyst',
      'Analytics Engineer',
      'Data Visualization Specialist',
      'MLOps Engineer'
    ],
    challenges: [
      'Finding candidates with both technical depth and business acumen',
      'Building and maintaining data pipelines at scale',
      'Ensuring data quality and governance',
      'Translating complex analyses into actionable insights'
    ],
    stats: [
      '11.5 million data science jobs by 2026',
      '$274.3 billion global big data market by 2027',
      '35% of companies actively using AI in their business operations'
    ],
    lucideIcon: Cpu
  },
  'fintech': {
    name: 'Fintech',
    icon: '💰',
    color: 'bg-lime-50',
    accentColor: 'bg-lime-600',
    textColor: 'text-lime-700',
    buttonColor: 'bg-lime-600 hover:bg-lime-700',
    image: '/images/fintech.png',
    description: 'Specialized recruitment for financial technology roles in banking, payments, and insurance tech.',
    longDescription: 'Financial technology is transforming banking, payments, lending, insurance, and wealth management, creating more accessible, efficient, and personalized financial services. Fintech companies and traditional financial institutions are competing for specialized talent who understand both financial services and modern technology stacks. Our fintech recruiters have deep domain knowledge in areas like payment systems, regulatory requirements, blockchain, and AI-driven risk management to help companies build teams that can develop innovative, compliant, and secure financial solutions.',
    keyRoles: [
      'Payments Engineer',
      'Quantitative Analyst',
      'Risk Modeling Specialist',
      'Blockchain Developer',
      'Regulatory Technology Expert',
      'Financial Data Scientist',
      'Digital Banking Product Manager'
    ],
    challenges: [
      'Navigating complex financial regulations and compliance',
      'Integrating with legacy financial systems',
      'Balancing innovation with security and risk management',
      'Building trust with consumers and financial institutions'
    ],
    stats: [
      '$305 billion invested in fintech companies since 2019',
      '96% of global consumers aware of at least one fintech service',
      '70% of financial services companies now partnering with fintech firms'
    ],
    lucideIcon: Cpu
  },
  'industry-research': {
    name: 'Industry Research',
    icon: '🔍',
    color: 'bg-yellow-50',
    accentColor: 'bg-yellow-600',
    textColor: 'text-yellow-700',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    description: 'Connecting researchers and R&D specialists with companies pushing the boundaries of technology.',
    longDescription: 'Industrial research and development drives the technological innovations that create competitive advantages and solve complex global challenges. From materials science to quantum computing to renewable energy, companies investing in R&D need specialists who can translate scientific discoveries into practical applications. Our industry research recruitment team specializes in connecting corporate research labs, innovation centers, and R&D-intensive organizations with PhD-level scientists, research engineers, and technical leaders who can advance fundamental knowledge while keeping sight of commercial applications.',
    keyRoles: [
      'Research Scientist',
      'R&D Engineer',
      'Materials Scientist',
      'Quantum Computing Researcher',
      'Advanced Manufacturing Specialist',
      'Technology Transfer Manager',
      'IP Strategy Consultant'
    ],
    challenges: [
      'Bridging the gap between academic research and commercial application',
      'Managing long-term research initiatives with uncertain outcomes',
      'Attracting specialized PhD talent to industry positions',
      'Protecting intellectual property while fostering collaboration'
    ],
    stats: [
      '$2.4 trillion in global R&D spending annually',
      '40% increase in corporate research publications in the past decade',
      '18 months average time from discovery to application in high-tech fields'
    ],
    lucideIcon: CircuitBoard
  }
};
