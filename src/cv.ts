import { CV } from "./model.ts";

export const cv: CV = {
  basics: {
    name: `Nuno Rodrigues`,
    label: `Engineering Lead / Full-stack Software Engineer`,
    image: `https://cv.nunorodrigues.tech/assets/avatar.jpg`,
    summary: `I am a passionate engineering lead / full-stack software engineer that loves his job.
I have broad experience in building stable and scalable products / services that users love.

I always have been very curious and enthusiastic about technology.
I love to learn, understand how things work and solve problems.
I really like to design and build software.
I also really enjoy helping people learn and grow.`,
    email: `nunomr@gmail.com`,
    // url: `https://cv.nunorodrigues.tech/`,
    location: {
      countryCode: `PT`,
      country: `Portugal`,
      city: `Lisbon`,
    },
    profiles: [
      {
        network: `github`,
        url: `https://github.com/NMFR`,
        username: `NMFR`,
      },

      {
        network: `linkedin`,
        username: `nmfr`,
        url: `https://www.linkedin.com/in/nmfr`,
      },
    ],
  },
  work: [
    {
      name: `BP`,
      position: `Full-stack Software Engineer (contractor)`,
      url: `https://www.bp.com/`,
      location: `Remote`,
      startDate: new Date(`2023-06-14`),
      endDate: undefined, //new Date(`2024-09-20`),
      summary: `Helping BP create and build internal products in the data space.`,
      highlights: [
        `Created a proof of concept application to manage resources utilization and predict / project future demand.`,
        `Upgraded a legacy Excel "application" with thousands of unique formulas to a modern application by building a code generator to facilitate the formula "translation".`,
        `Helped build a data processing platform, built on top of Dagster, that defines data as code to increase consistency and reusability.`,
        `Improved the Dagster control and data plane communication from direct database access to a well defined GraphQL interface.`,
        `Helped implement a data pipeline execution abstraction that allows pipelines to be run in diverse compute environments (Kubernetes, AWS ECS, bare metal) with ease.`,
        `Key technologies: Python / Dagster / GraphQL / React / Terraform / .Net / Kubernetes`,
      ],
    },
    {
      name: `Mara`,
      position: `Full-stack Software Engineer (contractor)`,
      url: `https://www.mara.xyz/`,
      location: `Remote`,
      startDate: new Date(`2022-11-10`),
      endDate: new Date(`2023-02-10`),
      summary: `Helping Mara build a cryptocurrency exchange.`,
      highlights: [
        `Helped set the foundation of a cryptocurrency exchange from the order matching engine to the delivery of real time order book updates to the UI.`,
        `Key technologies: Golang / gRCP / Kafka / React / serverless.`,
      ],
    },
    {
      name: `Deliveroo`,
      position: `Senior Software Engineer (contractor)`,
      url: `https://deliveroo.co.uk/`,
      location: `Remote`,
      startDate: new Date(`2021-09-14`),
      endDate: new Date(`2022-09-14`),
      summary: `Deliveroo is a food takeout / groceries delivery service.
I was part of the platform engineering team.

Responsible for designing, implementing and maintaining infrastructure abstractions.
Enabling other teams to easily deploy their services (containers), load balancers, databases, message queues, ...
Abstracting infrastructure details, cloud providers, logging, monitoring, ... so other teams can focus only on their services and business goals.`,
      highlights: [
        `Created and maintained services using Golang and Deno.js to help collect and aggregate metrics.`,
        `Created a slack bot using Golang to manage low priority alerts.`,
        `Created and maintained terraform modules that provided compute, network and storage abstractions.`,
        `Optimized autoscaling strategies.`,
        `Key technologies: Golang / Terraform / Kubernetes / AWS / Deno.js / Node.js.`,
      ],
    },
    {
      name: `Cloudmobility (Mercedez-Benz AG)`,
      position: `Tech lead / Full stack developer`,
      url: `https://cloudmobility.io/`,
      location: `Remote`,
      startDate: new Date(`2019-03-12`),
      endDate: new Date(`2021-09-09`),
      summary: `Building an on premise cloud for Daimler / Mercedez-Benz AG.

Tech lead of the Kubernetes multi tenant services team.
Helping break down product requirements.
Designing and building services.
Leading and mentoring the tech team.`,
      highlights: [
        `Implemented a Kubernetes hard multi-tenancy service.`,
        `Built a proof of concept on how to improve the container runtime isolation by switching runc with gVisor or Firecracker or Kata.`,
        `Implemented single sign on using OAuth flows to our Keycloak.`,
        `Researched service meshes to provide out of the box container network observability, reliability and security.`,
        `Mentored team members.`,
        `Key technologies: Golang / Java / Python / Swift, PostgreSQL / MongoDb, Docker / Kubernetes and React / Redux.`,
      ],
    },
    {
      name: `KI challengers`,
      position: `Tech lead / Full stack developer`,
      url: `https://ki-challengers.com/`,
      location: `Lisbon`,
      startDate: new Date(`2019-01-02`),
      endDate: new Date(`2021-09-09`),
      summary: `KI challengers is a tech company incubator, building companies, their tech products and teams.

Most of my focus was on building the Cloudmobility (Mercedez-Benz AG) company.`,
      highlights: [
        `Lead a team to create an internal application to collect data about the company so decisions could be made around facts.`,
        `Helped build an on premise cloud (Cloudmobility).`,
        `Key technologies: Golang / Rust, PostgreSQL, Kubernetes, Terraform and AWS / Azure.`,
      ],
    },
    {
      name: `Frames™`,
      position: `Engineering lead`,
      url: `https://frames.news/`,
      location: `Lisbon (remote in the first year)`,
      startDate: new Date(`2016-05-01`),
      endDate: new Date(`2019-01-01`),
      summary:
        `Frames provides a service to online news media companies to automatically place beautiful, contextual charts in their articles.
Articles are automatically parsed and analyzed, the Frames curated charts database is searched,
if a chart is found that matches the context of the article it is automatically placed in the article.`,
      highlights: [
        `Responsible for everything tech at Frames, from architecture to implementation of the full tech stack.`,
        `Leading and mentoring the tech team.`,
        // `Implemented OAuth to allow different clients to be able to single sign on into our service.`,
        `Helped create an incredible user experience.`,
        `Key technologies: Node.js, React / Redux, PostgreSQL / Elasticsearch, Docker / Kubernetes and AWS.`,
      ],
    },
    {
      name: `observador.pt`,
      position: `Full stack developer (contractor)`,
      url: `https://observador.pt/`,
      location: `Lisbon`,
      startDate: new Date(`2015-08-01`),
      endDate: new Date(`2015-12-31`),
      summary: `Implemented observador.pt online newspaper user comment system.`,
      highlights: [`Key technologies: React / Redux / Webpack, Golang.`],
    },
    {
      name: `KPMG`,
      position: `Senior Software Engineer`,
      url: `https://home.kpmg/`,
      location: `Lisbon`,
      startDate: new Date(`2012-03-01`),
      endDate: new Date(`2016-06-01`),
      summary: `Worked in two KPMG consultancy projects.

        One for a UK based bank to build a complex financial product subscription application.
        Another one for an insurance company to build a accident management system.`,
      highlights: [
        `Lead developer designing and implementing BPM processes, web interfaces and integration services.`,
        `Responsible for training / coaching junior developers.`,
        `Key technologies: JavaScript / IBM BPM.`,
      ],
    },
    {
      name: `Simple Solutions`,
      position: `Software Developer`,
      url: `https://www.simplesolutions.pt/`,
      location: `Lisbon`,
      startDate: new Date(`2010-12-01`),
      endDate: new Date(`2012-02-28`),
      summary: `Simple Solutions is a small consultancy company that provided tech services on the .Net stack.`,
      highlights: [
        `Key technologies: C#, ASP.Net, SQL Server, JavaScript, jQuery.`,
      ],
    },
  ],
  education: [
    {
      startDate: new Date(`2004-09-01`),
      endDate: new Date(`2010-06-01`),
      area: `Information Technology`,
      studyType: `Bachelor + Master`,
      institution: `ISEL`,
      url: `https://www.isel.pt/cursos/licenciaturas/engenharia-informatica-e-de-computadores`,
    },
  ],
  skills: [
    {
      name: `Backend`,
      level: `Senior`,
      keywords: [`Golang`, `Node.js`, `Deno`],
    },

    {
      name: `Backend`,
      level: `Medium`,
      keywords: [`.Net / C#`, `Java`, `Rust`, `Python`],
    },
    {
      name: `Frontend`,
      level: `Senior`,
      keywords: [`JavaScript / TypeScript`, `React`, `Redux`],
    },
    {
      name: `Databases`,
      level: `Senior`,
      keywords: [`PostgreSQL`, `Microsoft SQL Server`, `Elasticsearch`],
    },
    {
      name: `Infrastructure`,
      level: `Senior`,
      keywords: [`Docker`, `Kubernetes`, `Terraform`],
    },
    { name: `Mobile`, level: `Medium`, keywords: [`iOS Swift`] },
    {
      name: `Cloud Providers`,
      level: `Medium`,
      keywords: [`AWS`, `Google Cloud Platform`, `Azure`],
    },
  ],
  interests: [
    { name: `Software development` },
    { name: `Anything tech` },
    { name: `Open Source` },
    { name: `Science` },
    { name: `Movies / TV Series` },
    { name: `Entrepreneurship` },
    { name: `Gaming` },
  ],
  references: [
    {
      reference: `Nuno was a software engineer in my data platform team at BP.
Nuno successfully implemented a GraphQL server and client in Python to streamline the control plane and data planes communication.
Nuno was also able to contribute to AKS auto-provisioning and auto-scaling to save cluster cloud cost.
I appreciate Nuno's enthusiasm, hard work and flexibility.`,
      name: `Jian Jiao, Head of Data Engineering and Data Management @ BP`,
    },
    {
      reference: `I worked with Nuno for several months at Deliveroo.
Our team focused on delivering abstractions for deciding which primitives to run workloads on, networking and databases.
Nuno was exceptional at delivering results and was behind some great initiatives which largely helped our monitoring posture.
He lead the charge in investigating optimizations to our autoscaling strategies, built a non-urgent but high priority alerting system,
changed our development workflow to make more use of devcontainers with VS Code (which significantly improved setup time),
significantly improved our database monitoring with custom tooling and became our go-to Kubernetes expert.
Nuno has a keen focus on terse but high quality code and likes to take a data driven approach to decision making,
which makes him a great candidate for discussion around key decisions.
It was great working with Nuno - he's an excellent addition to any team!`,
      name: `Sanyia Saidova, Senior Software Engineer @ Deliveroo`,
    },
    {
      reference: `Nuno is an experienced engineer who has been a pleasure to work with.
He has a combination of qualities valuable for any engineering team or project:
broad technical expertise, good people skills, and passion towards sharing his knowledge with others.
He showed ability to contribute to and lead projects with high degree of ambiguity,
independently learning a new problem space and proactively reaching out for guidance when necessary.
Nuno engages well with customers and other stakeholders, showing humility and compassion.
He quickly became a part of our team, showed high degree of initiative and regularly solicited feedback.`,
      name: `Anton Tolchanov, Engineering Manager @ Deliveroo`,
    },

    {
      reference: `Nuno carried the Frames product like no one else. From System Architecture
to Quality Assurance, he handled the stack and everyone working with it with an
impressive attention to detail and maintainability. Making sure the system scales
and correctly responds the the rapid evolution of features is a number one priority
that makes the life, as Nuno's manager, very easy. Highly recommended.`,
      name: `Leo Xavier, CTO @ Observador, Founder @ Frames`,
    },
    {
      reference: `Nuno is one of the best software engineers that I have worked with. He
is highly dedicated, creative and intelligent and as his team leader, I always
trusted that he would always present the best solution for our customer. He is
a great team member, always available to help and coach other team members, even
if it requires an extra effort. Despite his great skills, Nuno is very humble
and he is always trying to learn new things. Nuno is a person that every project
manager wants in his team. I feel very privileged to have met Nuno and to have
worked with him, it was a very enriching experience.`,
      name: `Andreia Melo, Manager @ KPMG`,
    },
    {
      reference: `Nuno is an highly motivated and focused developer but this is not enough
for him ! He is also good in gathering business requirement, support, troubleshooting
and everything else Murphy laws can throw in a project.`,
      name: `Rui Madaleno, IT Architect @ Acoreana`,
    },
    {
      reference: `Nuno is THE BEST software engineer I have ever had the pleasure of working
with. Period. He is the best! We worked on two big BPM projects. One of the projects
was an award winning IBM BPM Application for the Insurance industry. Probably
the most advanced IBM BPM application worldwide (I would bet on it). Nuno was
the mastermind behind that awesome piece of technology. Top notch! He knows everything
about software, architecture, programming languages, he is incredibly talented,
he coaches young developers, he loves his code, he loves quality, he breathes
software, and best of all he is funny as hell, the type that brings up the vibe
of a team and that makes you want to go to work the next day. I recommend him
unconditionally to any Software Architect role, any day. He's the best. Trust
me, he's the man! I would hire him tomorrow without a blink.`,
      name: `Pietro Casella, Senior Manager @ KPMG`,
    },
    {
      reference: `Nuno is a highly skilled IT professional, a world-class developer. There
are no unreachable goals, and everything he delivers is developed with robust
solutions for complex problems. He is technically the best IT professional I ever
worked. He is always ready to learn and improve his knowledge, and transfer that
to every team colleague. Actively helps in creating a good working environment.`,
      name: `Daniel Moura, Manager @ KPMG`,
    },
    {
      reference: `It was an immense experience working with Nuno. One of the best professionals
I have ever worked with. He is the real deal. Extremely productive and intelligent
with strong architecture analysis skills. He is always available to help his colleagues
and make us learn and evolve as professionals. This kind of availability is extremely
rare. On the personal level... the guy must be the most well-humored IT professional
on the planet! :)`,
      name: `Andre Vieira, Software developer @ KPMG`,
    },
  ],
};
