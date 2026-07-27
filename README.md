# ☁️ SkyVault

> **A Secure, Scalable and Intelligent Cloud Storage Platform**

SkyVault is a modern cloud storage platform that enables users to securely store, organize, search and share their files through an intuitive web application.

Unlike traditional cloud storage services, SkyVault introduces a **logical storage allocation model**, where users purchase storage plans from the platform while the underlying storage infrastructure remains abstracted. For the MVP, Google Drive serves as the storage backend, allowing the architecture to remain provider-independent and easily extendable to AWS S3, Azure Blob Storage, Google Cloud Storage, MinIO, or other object storage providers in the future.

The project is being developed as part of a complete Software Engineering lifecycle, beginning with formal requirements engineering and progressing through architecture, database design, backend development, frontend development, testing and deployment.

---

## 🚀 Project Vision

SkyVault aims to provide an affordable, secure and intelligent cloud storage solution that combines familiar file management capabilities with a scalable architecture and future-ready AI enhancements.

The platform focuses on:

- Secure file storage
- Logical storage management
- Subscription-based storage allocation
- Intelligent file discovery
- Provider-independent architecture
- Clean and maintainable system design

---

# ✨ Key Features

### 👤 User Management

- User Registration
- Email Verification
- JWT Authentication
- Password Recovery
- Profile Management

### 💾 Storage Management

- Subscription-based Storage Plans
- Additional Storage Purchase
- Logical Storage Allocation
- Storage Usage Monitoring
- Storage Quota Enforcement

### 📁 File & Folder Management

- Hierarchical Folder Structure
- File Upload
- File Download
- File Preview
- Rename & Move
- File Replacement
- Folder Management
- Recycle Bin

### 🔗 Secure File Sharing

- Secure View-only Links
- Link Expiration
- Link Revocation

### 🔍 Intelligent Search

- Keyword Search
- Natural Language Search
- Metadata-based Search
- Ranked Search Results

### 🛠 Administration

- User Management
- Storage Plan Management
- Platform Monitoring
- Storage Monitoring
- Operational Analytics

---

# 🏗 System Architecture

SkyVault follows a **Layered Architecture** with clear separation of concerns.

```
                Angular Frontend
                       │
                       ▼
          ASP.NET Core Web API (.NET 9)
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  Service Layer   Repository Layer   Infrastructure
        │              │              │
        ▼              ▼              ▼
   Business Logic   Entity Framework   Google Drive API
                       │
                       ▼
                  PostgreSQL
```

The storage provider is abstracted behind an interface, allowing the application to switch storage providers with minimal code changes.

---

# 🧩 Technology Stack

## Frontend

- Angular
- TypeScript
- HTML5
- CSS3

## Backend

- ASP.NET Core Web API (.NET 9)
- C#
- Entity Framework Core

## Database

- PostgreSQL

## Authentication

- JWT Authentication
- Password Hashing
- Email Verification

## Cloud Storage

- Google Drive API (MVP)

Future support:

- AWS S3
- Azure Blob Storage
- Google Cloud Storage
- MinIO

---

# 📂 Project Structure

```
SkyVault
│
├── Controllers
├── Services
├── Repositories
├── Interfaces
├── Models
├── DTOs
├── Data
├── Migrations
├── Middleware
├── Helpers
├── Configuration
└── Program.cs
```

The project follows the Repository-Service pattern to keep business logic independent from persistence and infrastructure.

---

# 🗄 Database Design

The application stores only **metadata** inside PostgreSQL.

Examples include:

- Users
- Storage Plans
- Subscriptions
- Additional Storage Purchases
- Files
- Folders
- Share Links
- Audit Logs
- Storage Providers
- Storage Accounts

Actual file contents are stored in Google Drive.

---

# 🔒 Security

SkyVault has been designed with security as a core principle.

Security measures include:

- JWT Authentication
- Password Hashing
- Email Verification
- Ownership Validation
- Role-based Authorization
- Secure Share Tokens
- Audit Logging
- Input Validation

---

# 📦 Storage Model

SkyVault separates **logical storage** from **physical storage**.

```
User
      │
      ▼
Logical Storage Allocation
      │
      ▼
Storage Account
      │
      ▼
Google Drive
```

Users never interact directly with the cloud provider.

The platform manages:

- Storage allocation
- Capacity monitoring
- Provider abstraction
- Future provider migration

---

# 🎯 MVP Scope

The Minimum Viable Product includes:

- User Authentication
- Storage Subscriptions
- File Upload & Download
- Folder Management
- Recycle Bin
- Secure File Sharing
- Intelligent Metadata Search
- Administration Dashboard
- Google Drive Integration

Future enhancements such as AI assistants, OCR, semantic search, file versioning, collaboration and multi-cloud distribution are intentionally excluded from the MVP.

---

# 🛣 Roadmap

- [x] Requirements Engineering
- [x] Software Requirements Specification (SRS)
- [x] Development Planning
- [x] System Design
- [x] Database Design
- [ ] Repository Layer
- [ ] Service Layer
- [ ] Authentication Module
- [ ] Storage Module
- [ ] File Management Module
- [ ] Folder Management Module
- [ ] Sharing Module
- [ ] Search Module
- [ ] Administration Module
- [ ] Frontend Development
- [ ] Testing
- [ ] Deployment

---

# 📖 Engineering Principles

This project is being developed following modern software engineering practices.

- Clean Architecture principles
- SOLID Principles
- Repository Pattern
- Dependency Injection
- Separation of Concerns
- RESTful API Design
- Database Normalization
- Scalable Cloud Architecture
- Provider Independence
- Security by Design

---

# 📚 Documentation

Project documentation includes:

- Software Requirements Specification (IEEE 29148)
- System Design Document
- Database Design
- API Documentation
- Backend Implementation Guide
- ER Diagrams
- Sequence Diagrams
- Deployment Diagrams

---

# 🤝 Contributing

Contributions, suggestions and feedback are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 👨‍💻 Author

**Muhammad Haroon Khalid**

BS Software Engineering  
COMSATS University Islamabad

---

# 📄 License

This project is developed for educational and research purposes. Licensing may be updated in future releases.

---

## ⭐ Project Status

**Currently under active development.**

SkyVault is progressing through the Software Development Life Cycle (SDLC), with the backend architecture and core modules currently being implemented.
