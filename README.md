# react-interview

This is a simple React application using Vite as the build tool. Candidates are expected to build a Todo List UI by consuming the provided API. The scaffold includes basic setup and configurations to get started quickly.

### Installation

This project provides a development environment using **devContainers**. Open the repository in a devContainer using your preferred IDE (e.g., VS Code). The devContainer will have all dependencies pre-installed.

## Contact

- Martín Fernández (mfernandez@crunchloop.io)

## About Crunchloop

![crunchloop](https://s3.amazonaws.com/crunchloop.io/logo-blue.png)

We strongly believe in giving back :rocket:. Let's work together [`Get in touch`](https://crunchloop.io/#contact).

### Environment Variables

This project uses environment variables for configuration. Copy the `.env.example` file to `.env` and modify the values as needed.

Available environment variables:

- `VITE_API_BASE_URL`: The base URL for the API
  - **Dev Container**: Use `http://host.docker.internal:3000`
  - **Local development**: Use `http://localhost:3000`

**Note**: The `.env` file is ignored by git for security reasons. Use `.env.example` as a template.

## Project Overview

This application allows users to create, delete and complete tasks organized in custom lists with an intuitive user interface.

### Architecture & Structure

The project follows a component-based architecture:

- **`src/components/`**: Contains all React components organized by functionality

  - **`atoms/`**: Reusable UI components like `Button.tsx` and `Input.tsx`
  - **`states/`**: Component states including `EmptyState.tsx` and `LoadingState.tsx`
  - **Main components**: `TaskManager.tsx`, `List.tsx`, `Item.tsx`, `CreateListForm.tsx`, `ListHeader.tsx`

- **`src/endpoints/`**: API client for backend communication, providing functions to perform HTTP requests.
- **`src/types/`**: TypeScript type definitions for `TodoItem`, `TodoList` and other data structures.
- **`src/assets/`**: Static assets like images and icons.
- **`src/main.tsx`**: Entry point of the application that renders the root React component and sets up the app. It also configures the React Query provider (`QueryClientProvider`) to enable data fetching capabilities throughout the application.
- **`src/App.tsx`**: Main application component.
- **`src/style.css`**: Global CSS styles and Tailwind CSS imports for the application.

### Technologies & Libraries

The project uses the following React ecosystem tools:

- **Tailwind CSS**: For styling and responsive design
- **TanStack React Query**: For efficient server state management, automatic synchronization and loading/error state handling
- **Sonner**: For toast notifications that enhance UX, especially for confirmations and error handling
- **Lucide React**: For consistent and customizable icons
- **TypeScript**: For type safety and better developer experience

### Vite Configuration

The `vite.config.ts` has been customized to include:

- **Proxy configuration**: Routes `/api/*` requests to the backend API
- **Environment-based configuration**: Uses `VITE_API_BASE_URL` for flexible API endpoint configuration

### Running the Project

There are **two ways** to run this project locally:

1. **Local Development (localhost)**:

   ```bash
   npm install
   npm run dev
   ```

   The app will run on `http://localhost:5173` and proxy API calls to `http://localhost:3000`

2. **Dev Containers**:
   - Open the project in VS Code with Dev Containers extension
   - API calls will be proxied to `http://host.docker.internal:3000`

### Backend Integration

This frontend application is designed to work with the **NestJS interview API**, providing endpoints for:

- Creating and deleting todo lists
- Adding, deleting and completing todo items
