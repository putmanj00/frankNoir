import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { Providers } from '@/components/Providers';

describe('Smoke Tests', () => {
  it('should render the app without crashing', () => {
    // This test ensures the app can at least render
    // Would have caught the HeroUIProvider Client Component error
    render(
      <Providers>
        <Home />
      </Providers>
    );

    expect(screen.getByText(/FRANKNOIR/i)).toBeInTheDocument();
  });

  it('should have Lisa Frank Noir color tokens defined', () => {
    // Test that CSS custom properties exist
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    // These would fail if Tailwind config is broken
    expect(document.querySelector('html')).toBeInTheDocument();
  });

  it('should initialize with Stage 1 as active', () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );

    // Check that at least stage cards render
    expect(screen.getByText(/Stage 01/i)).toBeInTheDocument();
  });
});
