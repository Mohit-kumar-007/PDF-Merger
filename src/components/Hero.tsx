import { SignedOut, SignUpButton } from '@clerk/clerk-react';
import './Hero.css';

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Merge PDF Files Easily</h1>
        <p className="hero-description">
          Combine multiple PDF files into one document quickly and securely. 
          No file size limits, no watermarks, 100% free.
        </p>
        <SignedOut>
          <div className="hero-cta">
            <SignUpButton mode="modal" />
            <p className="hero-subtext">Start merging PDFs in seconds</p>
          </div>
        </SignedOut>
      </div>
    </section>
  );
};
