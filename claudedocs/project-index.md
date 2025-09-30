# Homepage-Backend Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Pages & Routes](#pages--routes)
6. [Components Architecture](#components-architecture)
7. [State Management](#state-management)
8. [Styling System](#styling-system)
9. [Configuration Files](#configuration-files)
10. [Development Workflow](#development-workflow)
11. [Deployment](#deployment)

---

## Project Overview

**Project Name**: Homepage-Backend
**Type**: Professional Business Homepage with E-commerce & Admin System
**Framework**: Next.js 14 (App Router)
**Current Status**: Phase 1 Complete (1차완성)
**Development Server**: Port 3001

### Purpose
A professional MVP homepage designed to provide a complete business solution including:
- Public-facing marketing website
- Product catalog and e-commerce functionality
- User authentication and profile management
- Administrative dashboard for business management
- Professional, trust-focused design (no AI-style elements)

---

## Technology Stack

### Core Framework
- **Next.js**: 14.2.0 (App Router architecture)
- **React**: 18.x
- **TypeScript**: 5.x

### Styling & UI
- **Tailwind CSS**: 3.3.0 (Utility-first CSS framework)
- **PostCSS**: 8.x (CSS processing)
- **Autoprefixer**: 10.x (CSS vendor prefixing)

### UI Components & Icons
- **lucide-react**: 0.344.0 (Icon library)
- **recharts**: 3.2.1 (Data visualization for admin dashboard)

### Utilities
- **clsx**: 2.1.0 (Conditional className management)
- **tailwind-merge**: 2.2.1 (Merge Tailwind classes efficiently)

### Development Tools
- **ESLint**: 8.x (Code quality)
- **TypeScript**: Full type safety
- **Next.js ESLint Config**: 14.2.0

---

## Project Structure

```
Homepage-backend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage (/)
│   ├── providers.tsx            # Client-side providers wrapper
│   ├── globals.css              # Global styles
│   ├── about/
│   │   └── page.tsx            # Company information page
│   ├── services/
│   │   └── page.tsx            # Services page
│   ├── contact/
│   │   └── page.tsx            # Contact page
│   ├── products/
│   │   └── page.tsx            # Product catalog with cart integration
│   ├── checkout/
│   │   └── page.tsx            # Checkout & payment flow
│   ├── order-complete/
│   │   └── page.tsx            # Order confirmation page
│   ├── mypage/                  # User dashboard area
│   │   ├── layout.tsx          # Mypage layout with sidebar
│   │   ├── page.tsx            # Mypage dashboard
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile management
│   │   ├── orders/
│   │   │   └── page.tsx        # Order history
│   │   └── settings/
│   │       └── page.tsx        # User settings
│   └── admin/                   # Admin dashboard area
│       ├── layout.tsx          # Admin layout with sidebar
│       ├── page.tsx            # Admin dashboard
│       ├── users/
│       │   └── page.tsx        # User management
│       ├── products/
│       │   └── page.tsx        # Product management
│       ├── orders/
│       │   └── page.tsx        # Order management
│       └── settings/
│           └── page.tsx        # System settings
│
├── components/                  # Reusable React components
│   ├── layout/                 # Layout components
│   │   ├── header.tsx          # Main site header with auth
│   │   ├── footer.tsx          # Site footer
│   │   └── page-header.tsx     # Page header with breadcrumbs
│   ├── sections/               # Homepage sections
│   │   ├── hero.tsx            # Hero section
│   │   ├── benefits.tsx        # Benefits/features section
│   │   ├── hook.tsx            # Hook/attention section
│   │   ├── story.tsx           # Story section
│   │   ├── products-home.tsx   # Products showcase
│   │   ├── offer.tsx           # Special offer/CTA section
│   │   ├── features.tsx        # Features section
│   │   └── cta.tsx             # Call-to-action section
│   ├── auth/                   # Authentication components
│   │   ├── login-form.tsx      # Login modal form
│   │   ├── signup-form.tsx     # Signup modal form
│   │   ├── user-dropdown.tsx   # User menu dropdown
│   │   ├── auth-buttons.tsx    # Auth action buttons
│   │   ├── auth-guard.tsx      # User authentication guard
│   │   └── admin-guard.tsx     # Admin role guard
│   ├── admin/                  # Admin dashboard components
│   │   ├── admin-header.tsx    # Admin dashboard header
│   │   ├── admin-sidebar.tsx   # Admin navigation sidebar
│   │   ├── admin-breadcrumb.tsx # Breadcrumb navigation
│   │   └── data-table.tsx      # Reusable data table
│   ├── mypage/                 # User dashboard components
│   │   └── sidebar-nav.tsx     # Mypage navigation sidebar
│   └── ui/                     # UI primitives
│       └── modal.tsx           # Modal dialog component
│
├── contexts/                    # React Context providers
│   └── cart-context.tsx        # Shopping cart state management
│
├── public/                      # Static assets
│   └── logo.png                # Site logo
│
├── claudedocs/                  # Project documentation
│   └── project-index.md        # This file
│
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore rules
├── prd.md                      # Product Requirements Document
├── body.md                     # Body section requirements
├── header.md                   # Header requirements
├── admin.md                    # Admin dashboard requirements
├── mypage.md                   # Mypage requirements
└── users.md                    # User management requirements
```

---

## Key Features

### 1. Public Website Features
- **Professional Homepage**: Hero, benefits, story, products, and offer sections
- **Product Catalog**: Categorized products with filtering and FAQ
- **Company Information**: About, services, and contact pages
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px

### 2. E-commerce Features
- **Shopping Cart**:
  - Add/remove items
  - Update quantities
  - LocalStorage persistence
  - Real-time total calculation
- **Checkout Process**:
  - Customer information form
  - Delivery address input
  - Payment method selection (Card, TossPay, Bank Transfer)
  - Order summary
- **Order Confirmation**: Order complete page with order details

### 3. User Authentication & Profile
- **Login/Signup**: Modal-based authentication forms
- **User Dashboard (Mypage)**:
  - Profile overview
  - Order history
  - Points tracking
  - Settings management
- **Route Protection**: AuthGuard for authenticated routes

### 4. Admin Dashboard
- **Dashboard Overview**:
  - Key metrics (users, orders, revenue)
  - Sales charts (monthly trends, product sales)
  - Recent activity tables
  - Quick actions
- **User Management**: User list with role and status management
- **Product Management**: Product catalog administration
- **Order Management**: Order tracking and status updates
- **Settings**: System configuration
- **Route Protection**: AdminGuard for admin-only routes

### 5. Design System
- **Professional Aesthetic**: Clean, trust-focused design
- **No AI Elements**: No emojis, gradients, or flashy effects
- **Consistent Spacing**: py-16 lg:py-24 for sections
- **Color Palette**:
  - Primary: Blue (#3b82f6)
  - Background: White (#ffffff)
  - Text: Gray (#1e293b)
  - Accent colors for status badges

---

## Pages & Routes

### Public Routes
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage with all marketing sections |
| `/about` | `app/about/page.tsx` | Company information |
| `/services` | `app/services/page.tsx` | Services overview |
| `/contact` | `app/contact/page.tsx` | Contact information |
| `/products` | `app/products/page.tsx` | Product catalog with cart integration |
| `/checkout` | `app/checkout/page.tsx` | Checkout and payment |
| `/order-complete` | `app/order-complete/page.tsx` | Order confirmation |

### User Routes (Auth Required)
| Route | File | Description |
|-------|------|-------------|
| `/mypage` | `app/mypage/page.tsx` | User dashboard |
| `/mypage/profile` | `app/mypage/profile/page.tsx` | Profile management |
| `/mypage/orders` | `app/mypage/orders/page.tsx` | Order history |
| `/mypage/settings` | `app/mypage/settings/page.tsx` | User settings |

### Admin Routes (Admin Role Required)
| Route | File | Description |
|-------|------|-------------|
| `/admin` | `app/admin/page.tsx` | Admin dashboard with charts |
| `/admin/users` | `app/admin/users/page.tsx` | User management |
| `/admin/products` | `app/admin/products/page.tsx` | Product management |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order management |
| `/admin/settings` | `app/admin/settings/page.tsx` | System settings |

---

## Components Architecture

### Layout Components

#### Header (`components/layout/header.tsx`)
- **State Management**: Login state, mobile menu, modal controls
- **Features**:
  - Responsive navigation with mobile hamburger menu
  - Authentication state-aware navigation items
  - Login/Signup modals
  - User dropdown for logged-in users
  - Logo and active route highlighting
- **Dependencies**: Modal, LoginForm, SignupForm, UserDropdown

#### Footer (`components/layout/footer.tsx`)
- Company information
- Social links
- Copyright information

#### PageHeader (`components/layout/page-header.tsx`)
- Page titles and subtitles
- Breadcrumb navigation
- Reusable across all pages

### Homepage Sections

#### Hero (`components/sections/hero.tsx`)
- Main value proposition
- CTA buttons (Products, Contact)
- Center-aligned layout

#### Benefits (`components/sections/benefits.tsx`)
- 3-column grid of benefits
- Icon + title + description cards

#### Hook (`components/sections/hook.tsx`)
- Attention-grabbing message
- Customer pain point addressing

#### Story (`components/sections/story.tsx`)
- Company narrative
- Trust-building content
- 2-column layout (text + image)

#### ProductsHome (`components/sections/products-home.tsx`)
- Featured products showcase
- Links to full product catalog

#### Offer (`components/sections/offer.tsx`)
- Special offers
- Strong CTA elements

### Authentication Components

#### LoginForm (`components/auth/login-form.tsx`)
- Email and password inputs
- Form validation
- Success callback
- Switch to signup option

#### SignupForm (`components/auth/signup-form.tsx`)
- User registration form
- Form validation
- Success callback
- Switch to login option

#### UserDropdown (`components/auth/user-dropdown.tsx`)
- User profile menu
- Navigation links
- Logout functionality

#### AuthGuard (`components/auth/auth-guard.tsx`)
- Protects user routes
- Redirects to login if not authenticated

#### AdminGuard (`components/auth/admin-guard.tsx`)
- Protects admin routes
- Verifies admin role
- Redirects unauthorized users

### Admin Components

#### AdminHeader (`components/admin/admin-header.tsx`)
- Admin dashboard header
- Quick search
- Admin profile dropdown

#### AdminSidebar (`components/admin/admin-sidebar.tsx`)
- Navigation menu:
  - Dashboard
  - Users
  - Products
  - Orders
  - Settings
- Active route highlighting

#### AdminBreadcrumb (`components/admin/admin-breadcrumb.tsx`)
- Breadcrumb navigation for admin pages

#### DataTable (`components/admin/data-table.tsx`)
- Reusable table component
- Sorting functionality
- Pagination
- Row selection

### UI Components

#### Modal (`components/ui/modal.tsx`)
- Reusable modal dialog
- Backdrop click to close
- Title and content slots

---

## State Management

### Cart Context (`contexts/cart-context.tsx`)

**Purpose**: Manage shopping cart state globally

**State**:
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}
```

**Features**:
- Add items to cart
- Remove items from cart
- Update item quantities
- Clear entire cart
- Calculate total amount
- Count total items
- LocalStorage persistence

**Usage**:
```typescript
import { useCart } from '@/contexts/cart-context';

const { items, addItem, removeItem, totalAmount } = useCart();
```

### Local State Management
- **Authentication**: Local state in header component (will migrate to context/API)
- **Form State**: Component-local useState for forms
- **UI State**: Modal visibility, menu toggles, etc.

---

## Styling System

### Tailwind Configuration (`tailwind.config.ts`)

**Content Paths**:
- `./pages/**/*.{js,ts,jsx,tsx,mdx}`
- `./components/**/*.{js,ts,jsx,tsx,mdx}`
- `./app/**/*.{js,ts,jsx,tsx,mdx}`

**Dark Mode**: Class-based (`darkMode: 'class'`)

**Extended Theme**:
- Custom CSS variables for background and foreground colors

### Design Principles

#### Color Palette
- **Primary**: Blue (#3b82f6) - Buttons, links, highlights
- **Background**: White (#ffffff) - Main background
- **Text**: Gray (#1e293b) - Primary text
- **Borders**: Gray (#e5e7eb) - Subtle borders
- **Status Colors**:
  - Success: Green (#10b981)
  - Warning: Yellow (#f59e0b)
  - Danger: Red (#ef4444)
  - Info: Blue (#3b82f6)

#### Typography
- **Headings**: font-bold with responsive sizing
- **Body**: font-medium or font-normal
- **Size Scale**: text-sm to text-5xl

#### Spacing
- **Section Padding**: py-16 lg:py-24
- **Container**: max-w-7xl mx-auto px-6
- **Component Padding**: p-6 to p-8
- **Grid Gaps**: gap-4 to gap-8

#### Components
- **Cards**: bg-white border border-gray-200 rounded-lg shadow-sm
- **Buttons**: rounded-lg with transition-colors
- **Inputs**: border border-gray-300 rounded-lg with focus:ring-2
- **Shadows**: shadow-sm for subtle elevation

#### Prohibited Elements (Per Design Guidelines)
- No emojis
- No gradients (`linear-gradient`)
- No neon/glow effects
- No excessive animations (bounce, pulse, spin)
- No flashy color combinations
- No AI-related keywords ("revolutionary", "innovative", "smart")

---

## Configuration Files

### Next.js Config (`next.config.js`)
```javascript
{
  output: 'export',           // Static export mode
  trailingSlash: true,        // Add trailing slashes to URLs
  images: {
    unoptimized: true         // Disable image optimization for static export
  }
}
```

**Purpose**: Configure for static site generation compatible with Vercel deployment

### TypeScript Config (`tsconfig.json`)
- **Target**: ES5
- **Module**: ESNext
- **JSX**: preserve (Next.js handles transformation)
- **Strict Mode**: Enabled
- **Path Alias**: `@/*` maps to project root

### PostCSS Config (`postcss.config.js`)
```javascript
{
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

## Development Workflow

### Getting Started

1. **Install Dependencies**:
```bash
npm install
```

2. **Run Development Server**:
```bash
npm run dev
```
Server runs on: `http://localhost:3000` (configured to port 3001 in current setup)

3. **Build for Production**:
```bash
npm run build
```

4. **Start Production Server**:
```bash
npm start
```

5. **Lint Code**:
```bash
npm run lint
```

### File Structure Conventions

#### Page Files
- Use `page.tsx` for route pages
- Use `layout.tsx` for route layouts
- Place in appropriate `app/` subdirectory

#### Component Files
- Use lowercase with hyphens: `user-dropdown.tsx`
- Export default function with PascalCase name
- Place in logical `components/` subdirectory

#### Type Definitions
- Define interfaces/types at top of file
- Use TypeScript for all components
- Leverage Next.js built-in types

### State Management Patterns

1. **Local State**: useState for component-specific state
2. **Global State**: React Context for cart, auth (future)
3. **Server State**: To be implemented with API routes
4. **Form State**: Controlled components with useState

### Styling Patterns

1. **Utility-First**: Prefer Tailwind utilities
2. **Component Classes**: Use clsx/tailwind-merge for conditional classes
3. **Responsive Design**: Mobile-first with md: and lg: breakpoints
4. **Dark Mode Ready**: Class-based dark mode support configured

---

## Deployment

### Current Setup
- **Platform**: Vercel (recommended for Next.js)
- **Build Command**: `npm run build`
- **Output**: Static export mode enabled

### Deployment Steps

1. **Build Locally** (optional):
```bash
npm run build
```

2. **Deploy to Vercel**:
```bash
npx vercel
```

3. **Production Deployment**:
```bash
npx vercel --prod
```

### Environment Variables (Future)
- Payment gateway keys (TossPay)
- API endpoints
- Admin credentials
- Database connection strings

### Static Export Considerations
- Image optimization disabled (required for static export)
- No server-side rendering
- No API routes (will need separate backend or serverless functions)
- Client-side routing only

---

## API Integration Points (Future Implementation)

### Authentication API
- POST `/api/auth/login` - User login
- POST `/api/auth/signup` - User registration
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### User API
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile
- GET `/api/users/:id/orders` - Get user orders

### Product API
- GET `/api/products` - List products
- GET `/api/products/:id` - Get product details
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Order API
- POST `/api/orders` - Create order
- GET `/api/orders/:id` - Get order details
- GET `/api/orders` - List orders (admin)
- PUT `/api/orders/:id/status` - Update order status (admin)

### Payment API
- POST `/api/payments/toss` - TossPay payment initialization
- POST `/api/payments/confirm` - Confirm payment

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Considerations

- Static export for fast loading
- Image optimization (currently disabled, to be configured)
- Code splitting via Next.js App Router
- Lazy loading for heavy components
- LocalStorage for cart persistence

---

## Security Considerations

### Current Implementation
- Client-side authentication (temporary)
- LocalStorage for user data
- No API security layer yet

### Future Improvements
- Server-side authentication
- JWT tokens
- HTTPS enforcement
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection

---

## Testing Strategy (To Be Implemented)

### Unit Testing
- Component testing with Jest/React Testing Library
- Context provider testing
- Utility function testing

### Integration Testing
- Page flow testing
- Cart functionality testing
- Authentication flow testing

### E2E Testing
- Checkout process
- Admin dashboard workflows
- User journey testing

---

## Known Limitations & TODOs

### Current Limitations
1. **No Backend Integration**: All data is hardcoded or localStorage-based
2. **No Real Authentication**: Login/signup are client-side only
3. **No Payment Processing**: Checkout is simulated
4. **No Database**: Data doesn't persist across sessions
5. **Image Optimization Disabled**: Required for static export

### Planned Enhancements
1. Backend API integration
2. Real authentication system
3. TossPay payment integration
4. Database integration (PostgreSQL/MongoDB)
5. Admin data management
6. Email notifications
7. Order tracking system
8. Advanced product filtering
9. Search functionality
10. Analytics integration

---

## Development Guidelines

### Code Quality
- Use TypeScript strictly
- Follow ESLint rules
- Keep components small and focused
- Extract reusable logic
- Comment complex logic

### Naming Conventions
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with I prefix (optional)

### Git Workflow
- Main branch: `main`
- Feature branches: `feature/description`
- Commit messages: Descriptive and concise
- Current commits: Korean language

### Documentation
- Update this file when structure changes
- Document complex components
- Maintain PRD and requirement docs
- Keep API documentation current

---

## Support & Contact

For questions or issues with this project, refer to:
- **PRD**: `prd.md` - Product requirements
- **Design Specs**: `body.md`, `header.md`, `admin.md`, `mypage.md`
- **Project Status**: Git commit history

---

## Version History

- **1차완성** (da5369d, d558ebf) - Initial implementation complete
  - Homepage with all sections
  - Product catalog
  - Shopping cart
  - Checkout flow
  - User dashboard
  - Admin dashboard
  - Authentication UI

---

**Last Updated**: 2025-10-01
**Documentation Version**: 1.0.0
**Project Status**: Phase 1 Complete
