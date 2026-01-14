# BookWorm Client 📚

The frontend application for BookWorm - a personalized book recommendation and reading tracker built with Next.js 16, TypeScript, and modern UI libraries.

## 🚀 Features

### User Interface

- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Dark/Light Theme**: Theme switching with next-themes
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Accessible**: WCAG compliant components and navigation

### User Features

- **Authentication**: Sign in/sign up with JWT authentication
- **Dashboard**: Personalized recommendations and reading statistics
- **Book Browsing**: Search, filter by genre, and pagination
- **Personal Library**: Three shelves (Want to Read, Currently Reading, Read)
- **Reading Progress**: Track progress with pages or percentage
- **Reviews & Ratings**: Write and view book reviews
- **Reading Goals**: Set and track annual reading goals with charts
- **Tutorials**: Embedded YouTube videos for book recommendations

### Admin Features

- **Dashboard**: Analytics with charts and statistics
- **Book Management**: CRUD operations for books with image upload
- **User Management**: Role management and user administration
- **Genre Management**: Create and edit book categories
- **Review Moderation**: Approve or delete pending reviews
- **Tutorial Management**: Manage embedded YouTube links

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization for charts
- **Lucide React** - Beautiful icon library
- **Next Themes** - Theme management
- **TanStack Table** - Advanced data tables
- **Sonner** - Toast notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Navigate to client directory**

   ```bash
   cd bookworm-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## 🏃‍♂️ Running the Application

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
bookworm-client/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Protected pages
│   │   ├── admin/         # Admin routes
│   │   └── user/          # User routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── tables/           # Data table components
│   ├── charts/           # Chart components
│   ├── dialogs/          # Modal dialogs
│   └── navigation/       # Navigation components
├── constants/            # App constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── api.ts           # API client
│   ├── upload.ts        # File upload utilities
│   └── utils.ts         # General utilities
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## 🎨 Design System

### Colors

- Primary: Book-themed warm colors
- Neutral: Grayscale for text and backgrounds
- Accent: Used for highlights and interactive elements

### Typography

- Font: Geist (optimized by Next.js)
- Headings: Various sizes for hierarchy
- Body: Readable text with proper line heights

### Components

- All components are built with Radix UI primitives
- Styled with Tailwind CSS classes
- Fully accessible and keyboard navigable

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Build

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Test components on different screen sizes
4. Ensure accessibility compliance

## 📄 License

This project is part of the BookWorm application and follows the same license terms.
