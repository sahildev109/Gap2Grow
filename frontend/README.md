# Dynamic User Interface (Frontend)

## 📌 What It Does
This component is the visual and interactive layer that the user actually sees. It is responsible for orchestrating the user's journey, capturing inputs securely, securely keeping track of global state across multiple pages, and drastically transforming raw JSON data into beautiful, premium aesthetics and charts.
1. Provides the Login/Signup portal.
2. Manages file uploads (Drag & Drop UI) and communicates with multiple distinct API endpoints across different domains/ports.
3. Visualizes complex data using radial progress bars, status badges, timelines, and multi-layered cards.
4. Allows users to export High-Resolution PDF files locally from the browser.

## 🛠️ Tech Stack
*   **Core Framework:** React.js
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **Styling:** Vanilla CSS (Glassmorphism, CSS Variables, Keyframe Animations)
*   **Icons:** Lucide-React
*   **PDF Generation:** `html2canvas` & `jsPDF`

## 💡 How It Works
The app is wrapped in a global `DashboardContext` Provider. This prevents "prop-drilling" and allows any page in the app (like the Career Report page) to instantly know what happened on the previous page (like the Skill Gap page).
When a user clicks "Generate", the React component sets a local `loading` state to trigger beautiful spinners. It fires asynchronous `fetch` calls to the Node.js backend. Once the massive JSON object is returned, React quickly re-renders the DOM, mapping over the arrays to build the step-by-step roadmap UI. 
For downloads, `html2canvas` algorithmically paints a literal screenshot of the loaded DOM, which `jsPDF` then patches together into a paginated binary file sent straight to the user's download folder.

## 🎯 Why This is Useful
**Why React?**
React's component-based virtual DOM is practically required when dealing with massive, deeply nested, AI-generated JSON outputs. Modularity allows us to build a visually impressive `GlassCard` wrapper component once, and then inject dynamic AI data into it indefinitely.

**Why Vite?**
Vite replaces older bundlers like Create-React-App/Webpack. It uses native ES modules to provide near-instantaneous hot-module reloading (HMR). This drastically accelerates development speed, especially when tweaking complex CSS animations.

**Why High Aesthetics?**
Generative AI tools are becoming commonplace. In order to impress end-users, an AI product must feel premium, fluid, and magical. By heavily utilizing complex CSS gradients, hover-state physics, and glassmorphism transparency, the perceived value of the AI's output is vastly augmented.
