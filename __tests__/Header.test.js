import { render, screen } from '@testing-library/react';
import Header from '../app/_components/Header';
import { useAuth } from '../app/context/AuthContext';
import { useTheme } from '../app/context/ThemeContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../app/context/AuthContext');
jest.mock('../app/context/ThemeContext');

describe('Header', () => {
  it('renders the header with the logo and title', () => {
    useAuth.mockReturnValue({ user: null });
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });

    render(<Header />);

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('Trackify')).toBeInTheDocument();
  });

  it('renders the dashboard and transactions links when a user is logged in', () => {
    useAuth.mockReturnValue({ user: { name: 'Test User' } });
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: jest.fn() });

    render(<Header />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});
