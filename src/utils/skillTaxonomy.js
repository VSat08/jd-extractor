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
  { 
    name: 'Go', 
    aliases: [
      'golang', 'go lang', 'go-lang', 'go language', 'go programming', 'go developer', 'go engineer', 'go backend',
      /\b(?:programming\s+languages?|technical\s+skills?)\s*:[^.\n]*?\bgo\b(?!\s+(?:to|beyond|forward|ahead|into|through|on|off|with|for|after))/i,
      /\b(?:python|java|rust|c\+\+|typescript|javascript)\s*,\s*go\b/i,
      /\bgo\s*,\s*(?:python|java|rust|c\+\+|typescript)/i
    ] 
  },
  { name: 'Rust', aliases: ['rust', 'rustlang', 'rust lang', 'rust programming'] },
  { name: 'PHP', aliases: ['php', 'php7', 'php8'] },
  { name: 'Ruby', aliases: ['ruby', 'ruby lang', 'ruby programming'] },
  { name: 'Swift', aliases: ['swift', 'swiftui'] },
  { name: 'Kotlin', aliases: ['kotlin'] },
  { name: 'Dart', aliases: ['dart', 'dart lang'] },
  { name: 'SQL', aliases: ['sql', 't-sql', 'pl/sql', 'plsql'] },
  { name: 'HTML5', aliases: ['html', 'html5'] },
  { name: 'CSS3', aliases: ['css', 'css3', 'scss', 'sass', 'less'] },
  { name: 'Bash / Shell', aliases: ['bash', 'shell script', 'shell scripting', 'powershell', 'sh'] },
  { name: 'Scala', aliases: ['scala'] },
  { 
    name: 'R', 
    aliases: [
      'r-lang', 'r language', 'r programming', 'r script', 'r scripting', 'rstudio', 'cran', 'r/python', 'python/r',
      /\b(?:programming\s+languages?|data\s+science\s+tools?)\s*:[^.\n]*?\br\b(?!\s*&)/i,
      /\b(?:python|sql|sas|matlab|spss|stata|julia)\s*[,/]\s*r\b(?!\s*&)/i,
      /\br\s*[,/]\s*(?:python|sql|sas|matlab|spss|stata|julia)\b/i
    ] 
  },

  // ── 2. Frontend Frameworks & Libraries ──
  { name: 'React', aliases: ['react', 'react.js', 'reactjs'] },
  { name: 'Angular', aliases: ['angular', 'angularjs', 'angular 2+', 'angular 14', 'angular 15', 'angular 16'] },
  { name: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs', 'vue 3'] },
  { name: 'Next.js', aliases: ['next.js', 'nextjs', 'next js', 'next/react', 'react/next'] },
  { name: 'Nuxt.js', aliases: ['nuxt', 'nuxt.js', 'nuxtjs'] },
  { name: 'Svelte', aliases: ['svelte', 'sveltekit'] },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwind css', 'tailwindcss'] },
  { name: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { name: 'Context API', aliases: ['context api', 'react context'] },
  { name: 'Zustand', aliases: ['zustand'] },
  { name: 'Pinia', aliases: ['pinia'] },
  { name: 'RxJS', aliases: ['rxjs', 'ngrx'] },
  { name: 'Webpack', aliases: ['webpack'] },
  { name: 'Vite', aliases: ['vite', 'vitejs'] },
  { name: 'Bootstrap', aliases: ['bootstrap', 'bootstrap 4', 'bootstrap 5'] },
  { name: 'Responsive Web Design', aliases: ['responsive design', 'mobile-first', 'responsive web design', 'css flexbox', 'css grid'] },

  // ── 3. Backend Frameworks & Runtimes ──
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node js', 'node/express'] },
  { name: 'Express.js', aliases: ['express.js', 'expressjs', 'express js', 'node/express', 'express framework'] },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js'] },
  { name: 'Spring Boot', aliases: ['spring boot', 'springboot', 'spring framework', 'spring mvc', 'spring cloud', 'spring security'] },
  { name: 'FastAPI', aliases: ['fastapi', 'fast-api', 'fast api'] },
  { name: 'Django', aliases: ['django', 'django rest framework', 'drf'] },
  { name: 'Flask', aliases: ['flask', 'flask api', 'flask framework'] },
  { name: '.NET', aliases: ['.net', '.net core', 'dotnet', 'asp.net', 'asp.net core'] },
  { name: 'Ruby on Rails', aliases: ['ruby on rails', 'ruby-on-rails', 'rails framework', 'ror'] },
  { name: 'GraphQL', aliases: ['graphql', 'apollo graphql', 'apollo client'] },
  { name: 'REST APIs', aliases: ['rest api', 'rest apis', 'restful', 'restful apis', 'api design'] },
  { name: 'Microservices', aliases: ['microservices', 'microservice architecture', 'micro-services'] },
  { name: 'Hibernate / JPA', aliases: ['hibernate', 'jpa', 'spring data jpa', 'orm'] },
  { name: 'gRPC', aliases: ['grpc'] },
  { name: 'WebSockets', aliases: ['websocket', 'websockets', 'socket.io'] },

  // ── 4. Mobile Development ──
  { name: 'React Native', aliases: ['react native', 'react-native', 'expo'] },
  { name: 'Flutter', aliases: ['flutter', 'dart/flutter'] },
  { name: 'iOS Development', aliases: ['ios development', 'ios developer', 'ios app', 'xcode'] },
  { name: 'Android Development', aliases: ['android development', 'android developer', 'android app', 'android studio', 'jetpack compose'] },

  // ── 5. Cloud & DevOps ──
  { name: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'aws lambda', 'ecs', 'eks', 'dynamodb', 'cloudfront', 'api gateway', 'codepipeline', 'sqs', 'sns'] },
  { name: 'Azure', aliases: ['azure', 'microsoft azure', 'azure devops', 'azure app services', 'azure app service', 'azure functions', 'aks', 'blob storage', 'cosmos db', 'azure container apps'] },
  { name: 'Google Cloud (GCP)', aliases: ['gcp', 'google cloud', 'google cloud platform', 'cloud run', 'gke', 'bigquery', 'cloud storage'] },
  { name: 'Docker', aliases: ['docker', 'docker container', 'docker-compose'] },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'Linux', aliases: ['linux', 'ubuntu', 'centos', 'redhat', 'debian', 'unix'] },

  // ── 6. Databases & Storage ──
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

  // ── 7. UI/UX & Product Design ──
  { name: 'UI/UX Design', aliases: ['ui/ux', 'ui-ux', 'ux design', 'ui design', 'wireframing', 'wireframes', 'prototyping', 'mockups', 'user experience design'] },
  { name: 'Figma', aliases: ['figma', 'figjam'] },
  { name: 'Design Systems', aliases: ['design systems', 'design system', 'storybook', 'atomic design', 'material design'] },

  // ── 8. Software Testing & QA ──
  { name: 'Unit Testing', aliases: ['unit testing', 'unit tests', 'jest', 'pytest', 'junit', 'vitest', 'mocha', 'chai', 'tdd', 'test driven development'] },
  { name: 'End-to-End Testing (E2E)', aliases: ['e2e', 'e2e testing', 'end to end testing', 'end-to-end testing', 'cypress', 'playwright', 'selenium'] },
  { name: 'Integration Testing', aliases: ['integration testing', 'integration tests', 'component testing'] },
  { name: 'React Testing Library', aliases: ['react testing library', 'rtl'] },

  // ── 9. Authentication & Security ──
  { name: 'Authentication & Security', aliases: ['authentication', 'authorization', 'oauth', 'oauth2', 'jwt', 'json web tokens', 'oidc', 'sso', 'single sign-on', 'saml', 'rbac', 'okta', 'auth0'] },

  // ── 10. Engineering Practices & Architecture ──
  { name: 'System Design', aliases: ['system design', 'high level design', 'low level design', 'distributed systems', 'scalability'] },
  { name: 'Object-Oriented Programming (OOP)', aliases: ['oop', 'object-oriented', 'object oriented programming', 'solid principles'] },
  { name: 'Agile / Scrum', aliases: ['agile', 'scrum', 'kanban', 'sprint planning', 'jira', 'safe', 'scaled agile', 'scrum master'] },
  { name: 'Git', aliases: ['git', 'github', 'gitlab', 'version control', 'bitbucket'] },

  // ── 11. AI, Data & Machine Learning ──
  { name: 'Machine Learning', aliases: ['machine learning', 'ai/ml', 'scikit-learn', 'deep learning', 'computer vision', 'nlp', 'natural language processing'] },
  { name: 'Generative AI / LLMs', aliases: ['generative ai', 'genai', 'llm', 'llms', 'prompt engineering', 'openai', 'gemini', 'langchain', 'llamaindex', 'crewai', 'hugging face', 'transformers'] },
  { name: 'PyTorch', aliases: ['pytorch'] },
  { name: 'TensorFlow', aliases: ['tensorflow', 'keras'] },
  { name: 'Data Engineering', aliases: ['data engineering', 'etl', 'data pipelines', 'spark', 'pyspark', 'hadoop', 'airflow', 'apache airflow', 'dbt', 'databricks', 'iceberg'] },

  // ── 12. Product & Leadership ──
  { name: 'Product Management', aliases: ['product management', 'product manager', 'product roadmap', 'user stories', 'a/b testing'] },
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
      if (alias instanceof RegExp) {
        if (alias.test(text)) {
          matched.add(item.name);
          break;
        }
      } else {
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
  }

  return Array.from(matched);
}

