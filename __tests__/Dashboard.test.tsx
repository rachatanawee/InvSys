import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

// Mock hooks
vi.mock('../hooks/useInventory', () => ({
  useInventory: vi.fn()
}));

vi.mock('../hooks/useTranslation', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.title': 'Dashboard',
        'dashboard.loading': 'Loading...',
        'dashboard.totalUnits': 'Total Units',
        'dashboard.productSKUs': 'Product SKUs',
        'dashboard.locations': 'Locations',
        'dashboard.totalMovements': 'Total Movements',
        'dashboard.chartTitle': 'Top 10 Products',
        'dashboard.chartLegend': 'Quantity'
      };
      return translations[key] || key;
    }
  }))
}));

// Mock recharts
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="container">{children}</div>
}));

// Mock UI components
vi.mock('../components/ui/Card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: any) => <p data-testid="card-description">{children}</p>
}));

vi.mock('../components/ui/Icons', () => ({
  PackageIcon: () => <div data-testid="package-icon" />,
  ArrowRightLeftIcon: () => <div data-testid="arrow-icon" />
}));

import { useInventory } from '../hooks/useInventory';

const mockUseInventory = useInventory as any;

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseInventory.mockReturnValue({
      isLoadingProducts: true,
      isLoadingMovements: false,
      isLoadingLocations: false
    });

    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders dashboard with data', () => {
    mockUseInventory.mockReturnValue({
      products: [
        { id: '1', name: 'Product 1', quantity: 100 },
        { id: '2', name: 'Product 2', quantity: 50 }
      ],
      movements: [{ id: '1' }],
      locations: [{ id: '1' }],
      isLoadingProducts: false,
      isLoadingMovements: false,
      isLoadingLocations: false
    });

    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('calculates totals correctly', () => {
    mockUseInventory.mockReturnValue({
      products: [
        { id: '1', name: 'Product 1', quantity: 100 },
        { id: '2', name: 'Product 2', quantity: 200 }
      ],
      movements: [{ id: '1' }],
      locations: [{ id: '1' }, { id: '2' }, { id: '3' }],
      isLoadingProducts: false,
      isLoadingMovements: false,
      isLoadingLocations: false
    });

    render(<Dashboard />);
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // products count
  });
});