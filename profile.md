<h1 align="center">👋 Hi, I'm Daniel Inarejos</h1>
<h3 align="center">Senior Backend Developer | Node.js · TypeScript · Google Cloud · Scalable Systems</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Senior-informational?style=flat&logo=node.js&logoColor=white&color=2bbc8a"/>
  <img src="https://img.shields.io/badge/GCP-Certified-blue?style=flat&logo=google-cloud&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-Lover-3178c6?style=flat&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Clean Code-Evangelist-ffcc00?style=flat"/>
</p>

---

### 🚀 About Me

💼 **12+ years** building backends that **scale, perform and last**.  
🔁 Specialized in **Node.js**, **TypeScript** and **Google Cloud Platform (GCP)**.  
🧠 Passionate about **code optimization**, clean architecture and distributed systems.  
🤝 I've worked with high-performing teams in **startups, scale-ups and corps**.  
🛠️ Collaborator on internal tools, APIs, technical decision-making, and microservices across several companies.

---

### 🛠️ Tech Stack

- **Languages**: TypeScript · JavaScript · Go · Python · PHP
- **Backend**: Node.js · Express/Fastify · RestFul · GraphQL · Web3 · Deno · Bun
- **Cloud & DevOps**: Google Cloud (Cloud Functions, Pub/Sub, Cloud Run) · Docker · GitHub Actions · GitLab
- **Databases**: SQL · MongoDB · Redis · Datastore · ElasticSearch
- **Testing**: Jest · Mocha/chai · Supertest · Artillery · Clinic.js 
- **Methodologies**: Functional programming · Object-Oriented Programming · GitFlow · Clean Architecture · Clean Code · SOLID · CI/CD · TDD

---

### 📂 Featured Work

| Project | Description | Stack |
|--------|-------------|-------|
| `Space` | Cloud-based system on GCP that dynamically launches virtual machines to serve real-time 3D apartment tours (rendered in Unreal Engine) directly in the browser. Automates the deployment of TURN servers and Unreal environments on demand, optimizing cost and ensuring high availability. | Node.js · GCP · Compute Engine · Cloud Functions · Unreal Engine ... |
| `Swish` | Mobile app for advanced basketball statistics, designed for international amateur leagues. The backend is built with a GraphQL Federation architecture and a fully scalable microservices environment deployed on Google Cloud Platform. | Node.js · GCP · GraphQL Federation · Cloud Run · Pub/Sub · MongoDB · Datastore, ... |
| `Back-office Fourvenues` | Event management platform for nightlife venues, designed to simplify business operations with powerful client analytics and financial tracking. Built with Node.js and TypeScript on Google Cloud, with a strong focus on performance optimization, scalability, and advanced search capabilities using ElasticSearch. | Node.js · TypeScript · GCP · ElasticSearch · Cloud Run · MongoDB |
| `Point Of Sale` | API for TPV (point-of-sale) devices, designed to manage and log all payment information for venue owners. Integrated with Adyen's payment system using its APIs and webhooks for real-time transaction tracking and reconciliation. | Node.js · TypeScript · GCP · Adyen API · Webhooks |
| `Studio` | Platform that connects property owners looking to renovate their homes with in-house architects from Clikalia’s studio. Focused on streamlining renovation requests and project coordination. | Node.js · TypeScript · GCP · REST API |
| `Rentals` | Rental platform for Clikalia properties, including a private client area where users can manage their personal information and all data related to their rental agreements. | Node.js · TypeScript · GCP · Firebase Auth · Firestore |
| `Back-office Clikalia` | Internal tool for managing the status and lifecycle of real estate properties. Focused on code optimization, project stabilization, and integration with SharePoint for storing files related to properties and clients. | Node.js · TypeScript · GCP · SharePoint |
| `SkySphere` | Full-stack social platform for FPV drone pilots to share flights, manage equipment, discover spots, and connect with the community. Complete end-to-end development including backend API, frontend SPA, and cloud infrastructure deployment. | Vue.js · Node.js · TypeScript · MongoDB Atlas · Render · Cloudflare · Firebase · Redis · Upstash · Namecheap · MailSender |


> Note: Company repositories are private due to NDA restrictions, but you can view technical summaries [here](#📘-project-summaries)

---

### 📘 Project Summaries

🔐 **Company Clikalia – Space**
> I designed and developed the backend architecture for Space, a solution that enables real-time virtual tours of properties rendered in Unreal Engine, accessible directly from the browser in first-person mode, with full movement and interaction.
The system consists of an API that manages the upload of virtual tour assets to a Google Cloud bucket. This event triggers a function captured by a service responsible for automatically creating and preparing a persistent disk on Google Compute Engine. The disk includes everything needed to launch the tour in various regions, optimizing availability and latency.
When a user requests a virtual guided tour, the system selects the appropriate disk, configures and launches a virtual machine on demand, which runs a TURN server and the Unreal Engine project, handling reverse proxy routing to securely deliver the experience to the client.
Once the tour ends, the virtual machines are automatically shut down and deprovisioned to minimize operational costs.
The entire flow is fully orchestrated using Google Cloud tools such as Compute Engine, Cloud Storage, Cloud Logger, Cloud Monitoring, and Pub/Sub, with a strong focus on automation, efficiency, and cost control.


🔐 **Company NBN23 – Swish · InGame App**  
> I developed the backend architecture for two mobile applications focused on advanced basketball statistics and real-time game tracking for amateur leagues.
I implemented a microservices-based infrastructure deployed entirely on Google Cloud, using Node.js, TypeScript, Cloud Functions, Pub/Sub, Compute Engine, Cloud Run, Datastore, Logger, Monitoring and MongoDB.
The system was designed with an event-driven architecture, allowing for high scalability and effective decoupling between services.
I designed and built a real-time advanced statistics engine powered by MongoDB triggers, webhooks, and asynchronous event processing.
GraphQL Federation was used to provide a modular, efficient, and maintainable API layer.
The ecosystem included over 50 distributed microservices across Swish and InGame, all maintained with test coverage above 70%, ensuring code quality and system stability.
The entire platform was optimized to handle high-traffic scenarios, such as multiple games running simultaneously, ensuring performance, consistency, and reliability.


🔐 **Company Fourvenues  – Back-office · Point Of Sale **  
> I designed and developed an API for point-of-sale (POS) terminals, responsible for registering and validating ticket payments made by end users.
This information is later consumed and managed by the Back-office system, where I worked on breaking down the monolith into independent business verticals, making the platform more scalable and resilient under high load conditions.
I focused on optimizing the slowest and most frequently used endpoints, resulting in significant improvements in overall performance and user experience.
I also implemented integrated messaging systems via SMS and WhatsApp, improved internal searches using ElasticSearch, and developed the integration with Adyen, enabling detailed financial control over transactions processed through the POS system.


🔐 **Company Clikalia – Studio · Rentals · Back-office**  
 **Studio**
> I designed and built from scratch the backend architecture of Studio, a platform that connects property owners looking to renovate their homes with Clikalia’s in-house architects.
The system was focused on streamlining renovation requests and coordinating project workflows, ensuring smooth communication between all involved parties.
A key technical challenge was the dynamic generation of PDF documents using Puppeteer, followed by automated email delivery through the transactional email platform Brevo (formerly Sendinblue).

 **Rentals · Back-office**
> I developed key features for Clikalia's internal property management system, where the Backoffice handles the status of each property (e.g., published, available for rent).
When a property is ready, it is automatically published for clients to request a reservation or a visit.
Once a client passes the validation process and is approved, they can finalize the rental through their private dashboard, where they manage reservations and rental documentation.
The rental contract is generated from the Backoffice and sent to the client, who can digitally sign it via Signaturit within their private area.
This dashboard also allows users to upload documentation and manage any needs related to their rental.


 **SkySphere**
> SkySphere is a **personal project** that I designed, developed, and deployed entirely on my own. It's a comprehensive social platform specifically built for FPV (First Person View) drone pilots to connect, share experiences, and grow the community.
The platform allows pilots to log and share their flights with detailed telemetry data, manage their drone equipment inventory, discover and rate flying spots worldwide, create and join groups based on interests or locations, and engage through posts, comments, and social interactions.
**Backend Architecture:** Built with Bun.js and TypeScript with a Hono server, implementing clean architecture with proper separation of concerns. The API features JWT authentication, role-based authorization, comprehensive input validation with Zod, structured logging, and optimized database queries with aggregation pipelines.
**Frontend Development:** Developed as a Single Page Application (SPA) using Vue.js 3 with Composition API, TypeScript, and Tailwind CSS. Features responsive design, real-time updates, interactive maps for spot discovery, rich text editing, image upload with optimization, and comprehensive state management.
**Infrastructure & DevOps:** Deployed on a robust cloud infrastructure using MongoDB Atlas for primary database, Render for backend hosting with auto-scaling, Cloudflare for CDN and security, Firebase for file storage and real-time features, Redis (Upstash) for caching and session management, Namecheap for domain management, and MailSender for transactional emails.
The entire project showcases full-stack development capabilities, from database design and API architecture to modern frontend development and cloud infrastructure management.


---

### 📫 Contact

- 📧 **Email:** danielinarejosaroca@gmail.com  
- 🌐 **LinkedIn:** [linkedin.com/in/daniel-inarejos](https://www.linkedin.com/in/daniel-inarejos)
- 🛠️ **GitHub Projects:** Revisa los pinned repos para ver mis contribuciones

---

### ☕ Fun Facts

- I love tearing down legacy code and making it 10x cleaner and faster ⚔️
- I always have a terminal open, even when I’m cooking 🍳 (Yes, I love it both)
- Green tea is a must-have 🍵

---

