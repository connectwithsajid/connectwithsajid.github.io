/**
 * Curated portfolio knowledge chunks for RAG-lite retrieval.
 * Edit this file when projects, experience, or bio details change.
 */
export const KNOWLEDGE_CHUNKS = [
  {
    id: 'profile',
    title: 'Profile and bio',
    tags: ['about', 'bio', 'usc', 'location', 'who', 'background', 'spanish'],
    text: [
      'Sajid Shaikh is an AI and Data Engineer based in the San Francisco Bay Area.',
      'He is a University of Southern California (USC) Computer Science alumnus.',
      'He builds cloud data systems, ML-enabled workflows, and backend platforms that turn messy business data into reliable products.',
      'Focus areas include data pipelines, ML systems, graph analytics, backend APIs, and AI automation.',
      'He has 5+ years of software, data, and AI engineering experience.',
      'He welcomes portfolio questions in English or Spanish.',
      'Contact: connectwithsajid@gmail.com.',
      'Links: LinkedIn https://www.linkedin.com/in/connectwithsajid/, GitHub https://github.com/connectwithsajid/, YouTube https://www.youtube.com/@newbiecodes1319, portfolio https://connectwithsajid.github.io/.'
    ].join(' ')
  },
  {
    id: 'mentorship',
    title: 'Mentorship and booking',
    tags: ['mentorship', 'topmate', 'consulting', 'resume review', 'booking', 'coach'],
    text: [
      'For mentorship, resume review, or booking time with Sajid, use Topmate: https://topmate.io/connectwithsajid.',
      'Mention Topmate only when the visitor asks about mentorship, consulting, resume help, or scheduling a call.'
    ].join(' ')
  },
  {
    id: 'expertise',
    title: 'Expertise and tech stack',
    tags: ['skills', 'stack', 'python', 'java', 'aws', 'spark', 'rag', 'sql', 'expertise'],
    text: [
      'Core strengths: data engineering, AI/ML systems, backend platforms, and distributed systems.',
      'Data engineering: batch and automated pipelines, data quality checks, deduplication, common data models, large SQL/PySpark workflows, AWS Glue, Databricks, Spark, lineage, observability.',
      'AI and ML: predictive models, feature engineering, fuzzy matching, similarity scoring, graph analytics, object detection, NLP text mining, RAG-ready document processing, multimodal AI, model evaluation.',
      'Backend: Flask APIs, Java services, database modeling, auth, integrations, CI/CD, Docker, zero-downtime delivery.',
      'Languages: Python, Java, SQL, TypeScript, JavaScript, PHP.',
      'Data stack: PySpark, Databricks, Pandas, PostgreSQL, MySQL, AWS RDS, Tableau.',
      'Cloud/DevOps: AWS Lambda, Glue, Step Functions, MWAA, EC2, S3, Docker, Jenkins, Kubernetes, Git.'
    ].join(' ')
  },
  {
    id: 'experience-visic',
    title: 'Experience: Founding Engineer at VISIC',
    tags: ['visic', 'citywise', 'founding', 'backend', 'experience', 'job', 'work'],
    text: [
      'Feb 2026 - Present: Founding Engineer - Backend at VISIC, SF Bay Area.',
      'Architecting backend services from scratch, including REST APIs, database schemas, authentication, integrations, and deployment workflows for an early-stage product team.',
      'Flagship product: CityWise (https://citywise.app/), a live civic intelligence product that simplifies council and civic data into a location-aware experience.',
      'Ownership includes backend data workflows, product-facing infrastructure, APIs, and live product execution.',
      'Impact signal from portfolio: automation pipelines reduced manual work by about 80% in related data work; CityWise creates impact with civic audiences.'
    ].join(' ')
  },
  {
    id: 'experience-usc-fms',
    title: 'Experience: Research Assistant at USC FMS',
    tags: ['usc', 'research', 'nlp', 'rag', 'pdf', 'documents', 'experience'],
    text: [
      'Feb 2025 - May 2026: Research Assistant at USC Facilities Planning Management.',
      'Led engineers on an NLP-based text mining system to extract and structure information from large-scale PDF corpora.',
      'Work enabled downstream RAG context optimization and reduced manual document processing overhead at USC.',
      'Also directed cross-functional technical operations as Team Leader for the FMS department, maintaining an internal web platform and serving as primary technical escalation point.'
    ].join(' ')
  },
  {
    id: 'experience-kognitic',
    title: 'Experience: Data Science Engineer Intern at Kognitic',
    tags: ['kognitic', 'clinical', 'aws', 'glue', 'lambda', 'internship', 'experience'],
    text: [
      'Jul 2025 - Aug 2025: Data Science Engineer Intern at Kognitic, Inc.',
      'Automated structured clinical-trials data pipelines with AWS Glue, Lambda, and Step Functions.',
      'Reduced manual intervention by 80% while improving duplicate detection and data consistency.'
    ].join(' ')
  },
  {
    id: 'experience-usc-cs',
    title: 'Experience: Research Java Engineer at USC CS',
    tags: ['usc', 'java', 'pekko', 'distributed', 'graph', 'experience'],
    text: [
      'May 2025 - Aug 2025: Research Java Engineer - Distributed Systems at USC Thomas Lord Department of Computer Science.',
      'Built actor-based distributed query-engine components with Java and Apache Pekko for graph analytics workloads.',
      'Included registry-driven actor discovery, streaming operators, and benchmark flows.'
    ].join(' ')
  },
  {
    id: 'experience-zs',
    title: 'Experience: ZS Associates',
    tags: ['zs', 'consultant', 'databricks', 'pyspark', 'enterprise', 'experience'],
    text: [
      '2021 - 2024: Business Technology Solutions Associate / Consultant at ZS Associates.',
      'Delivered Flask, SQL, PySpark, Databricks, and AWS automation for enterprise data products.',
      'Optimized 100M+ record data marts and reduced legacy analytical turnaround time by up to 90%.'
    ].join(' ')
  },
  {
    id: 'experience-earlier',
    title: 'Earlier experience: DeeDee Labs and Jobmosis',
    tags: ['deedee', 'jobmosis', 'ionic', 'mobile', 'java', 'aws', 'experience'],
    text: [
      'Feb 2020 - May 2020: Software Developer at DeeDee Labs Private Limited.',
      'Built a mobile app for upper limb amputees with Ionic; led a cross-functional team of 5; used Amazon S3, PHP, MySQL.',
      'Jul 2018 - Dec 2019: Junior Java Software Developer at Jobmosis / LitmusBox.',
      'Worked on AI expert-system experiments, text-mining prediction workflows, and a Java-based AI prediction model deployed on AWS.'
    ].join(' ')
  },
  {
    id: 'project-citywise',
    title: 'Project: CityWise / VISIC',
    tags: ['citywise', 'visic', 'civic', 'product', 'project', 'flagship'],
    text: [
      'CityWise is Sajid\'s flagship shipped product from founding-engineer work at VISIC.',
      'It turns council and civic data into a product people can explore directly.',
      'Live product: https://citywise.app/. Case study: https://connectwithsajid.github.io/visic/.',
      'Design lesson from CityWise: production AI is about trustworthy translation from complexity into clarity, not generation alone.',
      'CityWise has been used in civic contexts including LA City Council related workflows described in his build logs.'
    ].join(' ')
  },
  {
    id: 'project-ai-voice-over',
    title: 'Project: AI Voice Over',
    tags: ['voice', 'groq', 'orpheus', 'video', 'transcription', 'project'],
    text: [
      'AI Voice Over is a browser-first GitHub Pages tool.',
      'It extracts speech from uploaded video, uses a user-provided Groq key for transcription (whisper-large-v3-turbo) and Orpheus voice generation, then renders a downloadable video locally.',
      'Stack themes: video-to-text, text-to-AI-voice, local render.',
      'Open tool: https://connectwithsajid.github.io/ai-voice-over/. Build log: https://connectwithsajid.github.io/blogs/ai-voice-over-build/.'
    ].join(' ')
  },
  {
    id: 'project-resume-optimizer',
    title: 'Project: Native Resume Optimizer',
    tags: ['resume', 'optimizer', 'latex', 'llm', 'local', 'project'],
    text: [
      'Native Resume Optimizer is an AI-powered resume tailoring pipeline.',
      'It reads a resume plus job description, rewrites only evidence-backed relevant bullets, and regenerates a polished PDF from the original LaTeX template.',
      'Design goals: evidence-preserving, LaTeX-to-PDF, 100% local-first.',
      'GitHub: https://github.com/connectwithsajid/resume-optimizer.',
      'Build log: https://connectwithsajid.github.io/blogs/resume-optimizer-build/.'
    ].join(' ')
  },
  {
    id: 'project-see-beyond',
    title: 'Project: See Beyond multimodal assistive AI',
    tags: ['see beyond', 'multimodal', 'blip', 'llava', 'accessibility', 'vision', 'project'],
    text: [
      'See Beyond is a multimodal assistive tool for visually impaired users.',
      'Combines Faster R-CNN object detection, BLIP-2 / LLaVA image captioning, OCR, and NLP-driven auditory feedback.',
      'Reported impact: about 92% mAP across 80+ object categories.',
      'Stack includes PyTorch, Hugging Face, React, Flask, VizWiz dataset.',
      'Blog: https://connectwithsajid.github.io/blogs/see-beyond-ai/.'
    ].join(' ')
  },
  {
    id: 'project-x-gastroai',
    title: 'Project: X-GastroAI',
    tags: ['x-gastroai', 'medical', 'resnet', 'grad-cam', 'explainable', 'project'],
    text: [
      'X-GastroAI is a clinician-facing gastric cancer screening pipeline.',
      'Uses ResNet-50 with Grad-CAM saliency maps for interpretable real-time predictions.',
      'Reported accuracy about 97.6%; Streamlit inference UI.',
      'Blog: https://connectwithsajid.github.io/blogs/x-gastroai/.'
    ].join(' ')
  },
  {
    id: 'project-clinical-pipeline',
    title: 'Project: Clinical Trials Data Quality Pipeline',
    tags: ['clinical', 'trials', 'etl', 'aws', 'data quality', 'project'],
    text: [
      'Clinical Trials Data Quality Pipeline automates clinical-trial ingestion, validation, deduplication, and fuzzy matching.',
      'Built with Python, SQL, and AWS services.',
      'Scale: 500K+ trial records; about 30% accuracy lift in matching/quality outcomes described on the portfolio.'
    ].join(' ')
  },
  {
    id: 'project-graph-engine',
    title: 'Project: Distributed Graph Query Engine',
    tags: ['graph', 'distributed', 'java', 'pekko', 'olap', 'project'],
    text: [
      'Distributed Graph Query Engine is an OLAP-style query engine using Java and Apache Pekko typed actors.',
      'Built for multi-cluster graph analytics workloads.',
      'Reported impact: about 40% lower latency and support for 10K+ concurrent queries.'
    ].join(' ')
  },
  {
    id: 'project-other',
    title: 'Other selected projects',
    tags: ['dermai', 'postgresql', 'neo4j', 'fraud', 'flask', 'project'],
    text: [
      'DermAI: three-class dermoscopy classifier with EfficientNet, Grad-CAM, SMOTE; about 89.6% macro F1.',
      'PostgreSQL B-Tree Index Optimization / BAOLITE: C-level PostgreSQL planner and index work; about 15% lower latency on OLAP benchmark queries.',
      'Customer Knowledge Graph: migrated RDF/SPARQL logic to Neo4j for microsegmentation, KOL identification, PageRank, K-means.',
      'Site Diversity Proposal: PySpark, AWS, Tableau analysis to propose top diversity-rich clinical sites.',
      'Flight Price Prediction: Flask predictive app with 85%+ accuracy.',
      'Credit Card Fraud Analysis: logistic regression pipeline with about 80% accuracy.',
      'Social Distancing Detector: TensorFlow video pipeline for distance violations.',
      'Bulk Upload Module: Angular + Flask + PostgreSQL Excel upload microservices.',
      'Role Predictor: Java AWS REST API for keyword weightings, tested with Postman on 500+ samples.',
      'Ambulance Tracking System: Firebase real-time geolocation portals for emergency response.'
    ].join(' ')
  },
  {
    id: 'blogs-themes',
    title: 'Blog themes and writing',
    tags: ['blog', 'writing', 'cicd', 'wasm', 'trust', 'build log'],
    text: [
      'Sajid writes technical build logs on AI systems, data pipelines, and backend products.',
      'Topics include AI Voice Over, CityWise trust systems, Resume Optimizer, data-driven CI/CD, See Beyond, BAOLITE PostgreSQL optimization, X-GastroAI, and WebAssembly runtime vulnerability testing.',
      'Recurring themes: evidence-preserving AI, production trust, validation systems for data-driven apps, and explainability.',
      'Blog index: https://connectwithsajid.github.io/#blogs.'
    ].join(' ')
  }
]

/** Always included so general questions still have grounding. */
export const ALWAYS_INCLUDE_IDS = ['profile', 'mentorship']
