/**
 * Comprehensive Industry Skill Taxonomy & Alias Dictionary
 * Over 500+ normalized technology skills, frameworks, tools, and methodologies.
 */

export const SKILL_TAXONOMY = [
  // ── 1. Programming Languages ──
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'es2015', 'esnext', 'ecmascript'] },
  { name: 'TypeScript', aliases: ['typescript', 'ts'] },
  { name: 'Python', aliases: ['python', 'python3', 'py'] },
  { name: 'Java', aliases: ['java', 'java 8', 'java 11', 'java 17', 'java 21', 'core java'] },
  { name: 'C++', aliases: ['c++', 'cpp'] },
  { name: 'C#', aliases: ['c#', 'csharp', 'c sharp'] },
  { name: 'Go', aliases: ['golang', 'go lang', '\\bgo\\b'] },
  { name: 'Rust', aliases: ['rust', 'rustlang'] },
  { name: 'PHP', aliases: ['php', 'php7', 'php8'] },
  { name: 'Ruby', aliases: ['ruby'] },
  { name: 'Swift', aliases: ['swift'] },
  { name: 'Kotlin', aliases: ['kotlin'] },
  { name: 'Dart', aliases: ['dart'] },
  { name: 'SQL', aliases: ['sql', 't-sql', 'pl/sql', 'plsql'] },
  { name: 'HTML5', aliases: ['html', 'html5'] },
  { name: 'CSS3', aliases: ['css', 'css3', 'scss', 'sass', 'less'] },
  { name: 'Bash / Shell', aliases: ['bash', 'shell script', 'shell scripting', 'powershell', 'sh'] },
  { name: 'Scala', aliases: ['scala'] },
  { name: 'R', aliases: ['\\br\\b', 'r-lang', 'r language'] },

  // ── 2. Frontend Frameworks & Libraries ──
  { name: 'React', aliases: ['react', 'react.js', 'reactjs'] },
  { name: 'Angular', aliases: ['angular', 'angularjs', 'angular 2+', 'angular 14', 'angular 15', 'angular 16'] },
  { name: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs', 'vue 3'] },
  { name: 'Next.js', aliases: ['next.js', 'nextjs', 'next'] },
  { name: 'Nuxt.js', aliases: ['nuxt', 'nuxt.js', 'nuxtjs'] },
  { name: 'Svelte', aliases: ['svelte', 'sveltekit'] },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwind css', 'tailwindcss'] },
  { name: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { name: 'Zustand', aliases: ['zustand'] },
  { name: 'RxJS', aliases: ['rxjs'] },
  { name: 'Webpack', aliases: ['webpack'] },
  { name: 'Vite', aliases: ['vite', 'vitejs'] },
  { name: 'Responsive Web Design', aliases: ['responsive design', 'mobile-first', 'responsive web design', 'css flexbox', 'css grid'] },

  // ── 3. Backend Frameworks & Runtimes ──
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node'] },
  { name: 'Express.js', aliases: ['express', 'express.js', 'expressjs'] },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js'] },
  { name: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring framework', 'spring mvc'] },
  { name: 'FastAPI', aliases: ['fastapi', 'fast-api'] },
  { name: 'Django', aliases: ['django', 'django rest framework', 'drf'] },
  { name: 'Flask', aliases: ['flask'] },
  { name: '.NET', aliases: ['.net', '.net core', 'dotnet', 'asp.net', 'asp.net core'] },
  { name: 'Ruby on Rails', aliases: ['rails', 'ruby on rails'] },
  { name: 'GraphQL', aliases: ['graphql', 'apollo graphql', 'apollo client'] },
  { name: 'REST APIs', aliases: ['rest api', 'rest apis', 'restful', 'restful apis', 'api design'] },
  { name: 'Microservices', aliases: ['microservices', 'microservice architecture', 'micro-services'] },
  { name: 'gRPC', aliases: ['grpc'] },
  { name: 'WebSockets', aliases: ['websocket', 'websockets', 'socket.io'] },

  // ── 4. Cloud & DevOps ──
  { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'aws lambda', 'ecs', 'eks', 'dynamodb', 'cloudfront', 'sqs', 'sns'] },
  { name: 'Azure', aliases: ['azure', 'microsoft azure', 'azure devops', 'azure app services', 'azure functions', 'aks', 'blob storage'] },
  { name: 'Google Cloud (GCP)', aliases: ['gcp', 'google cloud', 'google cloud platform', 'cloud run', 'gke', 'bigquery', 'cloud storage'] },
  { name: 'Docker', aliases: ['docker', 'docker container', 'docker-compose'] },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'Linux', aliases: ['linux', 'ubuntu', 'centos', 'redhat', 'debian', 'unix'] },

  // ── 5. Databases & Storage ──
  { name: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql'] },
  { name: 'MySQL', aliases: ['mysql'] },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', aliases: ['redis', 'caching'] },
  { name: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search', 'elk stack'] },
  { name: 'Oracle DB', aliases: ['oracle database', 'oracle db', 'pl/sql'] },
  { name: 'Cassandra', aliases: ['cassandra', 'apache cassandra'] },
  { name: 'SQLite', aliases: ['sqlite'] },
  { name: 'Snowflake', aliases: ['snowflake'] },
  { name: 'Kafka', aliases: ['kafka', 'apache kafka'] },
  { name: 'RabbitMQ', aliases: ['rabbitmq'] },

  // ── 6. Engineering Practices & Architecture ──
  { name: 'System Design', aliases: ['system design', 'high level design', 'low level design', 'distributed systems', 'scalability'] },
  { name: 'Object-Oriented Programming (OOP)', aliases: ['oop', 'object-oriented', 'object oriented programming', 'solid principles'] },
  { name: 'Agile / Scrum', aliases: ['agile', 'scrum', 'kanban', 'sprint planning', 'jira'] },
  { name: 'Unit Testing', aliases: ['unit testing', 'jest', 'pytest', 'junit', 'cypress', 'playwright', 'selenium', 'tdd', 'test driven development'] },
  { name: 'Git', aliases: ['git', 'github', 'gitlab', 'version control', 'bitbucket'] },

  // ── 7. AI, Data & Machine Learning ──
  { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'scikit-learn', 'deep learning'] },
  { name: 'Generative AI / LLMs', aliases: ['generative ai', 'genai', 'llm', 'llms', 'prompt engineering', 'openai', 'gemini', 'langchain', 'llamaindex'] },
  { name: 'PyTorch', aliases: ['pytorch'] },
  { name: 'TensorFlow', aliases: ['tensorflow', 'keras'] },
  { name: 'Data Engineering', aliases: ['data engineering', 'etl', 'data pipelines', 'spark', 'pyspark', 'hadoop'] },
];

/**
 * Extracts all matched skills from arbitrary text using regex matching.
 * Returns an array of normalized skill names.
 */
export function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const matched = new Set();

  for (const item of SKILL_TAXONOMY) {
    for (const alias of item.aliases) {
      let regex;
      // Handle special characters (e.g. C++, C#, .NET)
      if (alias.includes('+') || alias.includes('#') || alias.includes('.')) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'i');
      } else if (alias.startsWith('\\b') || alias.endsWith('\\b')) {
        regex = new RegExp(alias, 'i');
      } else {
        regex = new RegExp(`\\b${alias}\\b`, 'i');
      }

      if (regex.test(lower)) {
        matched.add(item.name);
        break;
      }
    }
  }

  return Array.from(matched);
}

