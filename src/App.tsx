import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { FileUpload } from './components/FileUpload';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Hero />
          <FileUpload />
          <Features />
        </main>
      </div>
    </ThemeProvider>
  );
}