import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { About } from './About';

describe('About', () => {
  const defaultProps = {
    content: 'I am a passionate web developer with 5+ years of experience building modern web applications.',
    stats: [
      { label: 'Years Experience', value: '5+', description: 'Professional development' },
      { label: 'Projects Completed', value: '20+', description: 'Open source & client work' },
      { label: 'Technologies', value: '15+', description: 'Languages & frameworks' },
    ],
  };

  it('renders section heading', () => {
    render(<About {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Sobre mí' })).toBeInTheDocument();
  });

  it('renders content text', () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText(/I am a passionate web developer/)).toBeInTheDocument();
  });

  it('renders stats when provided', () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
  });

  it('renders without stats when not provided', () => {
    render(<About content="Test content" stats={[]} />);
    expect(screen.queryByText('Years Experience')).not.toBeInTheDocument();
  });

  it('applies about section composition', () => {
    render(<About {...defaultProps} />);
    const section = screen.getByRole('region', { name: /about/i });
    expect(getCssForElement(section)).toContain('min-height');
  });
});