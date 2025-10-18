# 🏗️ Hexagonal Architecture with Node.js & TypeScript

A modern, scalable backend implementation following **Hexagonal Architecture** (Ports and Adapters pattern) principles with Node.js, TypeScript, and best practices.

## 📋 Table of Contents

- [What is Hexagonal Architecture?](#what-is-hexagonal-architecture)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

## 🎯 What is Hexagonal Architecture?

**Hexagonal Architecture** (also known as **Ports and Adapters**) is a software design pattern that promotes:

- **🎯 Separation of Concerns** - Business logic isolated from external dependencies
- **🔌 Dependency Inversion** - Core business logic doesn't depend on external frameworks
- **🧪 Testability** - Easy to test business logic in isolation
- **🔄 Flexibility** - Easy to swap external dependencies (databases, APIs, frameworks)
- **📈 Maintainability** - Clean, organized code structure

### The "Hexagon" Concept

```
    🌐 External World
         ↕️
    🔌 Adapters (Ports)
         ↕️
   💎 Business Logic (Core)
```

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 EXTERNAL WORLD                        │
│  Web APIs │ Databases │ Message Queues │ File Systems      │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                   🔧 INFRASTRUCTURE LAYER                   │
│                                                             │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │   📥 PRIMARY     │              │   📤 SECONDARY   │      │
│  │   ADAPTERS       │              │   ADAPTERS       │      │
│  │                 │              │                 │      │
│  │ • HTTP Routes   │              │ • Databases     │      │
│  │ • GraphQL       │              │ • Email Service │      │
│  │ • CLI Commands  │              │ • File Storage  │      │
│  │ • Schedulers    │              │ • External APIs │      │
│  └─────────────────┘              └─────────────────┘      │
│           │                                │               │
│           ↓                                ↑               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  🔌 PORTS                               │ │
│  │           (Interfaces/Contracts)                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                  🎯 APPLICATION LAYER                       │
│                                                             │
│  • Use Cases (Business Operations)                         │
│  • DTOs (Data Transfer Objects)                            │
│  • Validators                                              │
│  • Mappers                                                 │
│  • Event Handlers                                          │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    💎 DOMAIN LAYER                          │
│                   (Pure Business Logic)                     │
│                                                             │
│  • Entities (Business Objects)                             │
│  • Value Objects (Immutable Values)                        │
│  • Domain Events                                           │
│  • Business Rules & Specifications                         │
│  • Domain Exceptions                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── 💎 domain/                    # CORE BUSINESS LOGIC
│   ├── entities/                 # Business entities
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── value-objects/           # Immutable values
│   │   ├── Email.ts
│   │   ├── Money.ts
│   │   └── Address.ts
│   ├── events/                  # Domain events
│   └── exceptions/              # Business exceptions
│
├── 🎯 application/              # USE CASES & ORCHESTRATION
│   ├── use-cases/              # Business operations
│   │   ├── user/
│   │   ├── product/
│   │   └── order/
│   ├── dto/                    # Data transfer objects
│   ├── mappers/               # Domain ↔ DTO conversion
│   └── validators/            # Input validation
│
├── 🔧 infrastructure/          # EXTERNAL CONCERNS
│   ├── 🔌 ports/              # INTERFACES (Contracts)
│   │   ├── repositories/      # Data access interfaces
│   │   └── services/         # External service interfaces
│   │
│   └── adapters/             # IMPLEMENTATIONS
│       ├── 📥 primary/        # INPUT ADAPTERS (Driving)
│       │   ├── http/         # REST API controllers
│       │   ├── graphql/      # GraphQL resolvers
│       │   └── cli/          # Command line interface
│       │
│       └── 📤 secondary/      # OUTPUT ADAPTERS (Driven)
│           ├── database/     # Database implementations
│           ├── external-apis/ # Third-party services
│           └── messaging/    # Message brokers
│
├── 🔄 shared/                  # CROSS-CUTTING CONCERNS
│   ├── utils/
│   ├── types/
│   └── constants/
│
└── 🧪 tests/                   # TESTING
    ├── unit/
    ├── integration/
    └── e2e/
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hexagonal-architecture
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```




**Built with ❤️ using Hexagonal Architecture principles**