// Mock NewCustomerFormWebPartStrings inline to ensure it works
jest.mock('NewCustomerFormWebPartStrings', () => ({
  FormAlertCustomerAdded: 'Customer {0} ({1}) added successfully.',
  FormErrorRequiredFields: 'Required fields missing.',
  FormErrorNameRequired: 'Name is required',
  FormErrorEmailRequired: 'Email is required',
  FormErrorCompanyRequired: 'Company is required',
  FormErrorSocialHandleFormat: 'Social handle must start with @',
  WelcomeTitle: 'Welcome, {0}!',
  FormLabelCustomerSector: 'Customer Sector:',
  FormLabelRequiresNDA: 'Requires NDA',
  FormSectorNonProfit: 'Non profit',
  FormSectorPrivate: 'Private',
  FormSectorGovernment: 'Government'
}));

// Mock @fluentui/react components that are used
jest.mock('@fluentui/react', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    MessageBar: React.forwardRef((props: Record<string, unknown>, ref: unknown) => 
      React.createElement('div', { 
        ref, 
        'data-testid': 'customer-notification',
        ...props 
      })
    ),
    MessageBarType: {
      info: 'info',
      error: 'error',
      blocked: 'blocked',
      severeWarning: 'severeWarning',
      success: 'success',
      warning: 'warning'
    },
    initializeIcons: jest.fn()
  };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewCustomerForm from './NewCustomerForm';
import { initializeIcons } from '@fluentui/react';

const baseProps = {
  userDisplayName: 'Test User',
  environment: 'TEST'
};

// Store original window.alert
const originalAlert = window.alert;

beforeAll(() => {
  initializeIcons();
  // Mock console methods to prevent warnings during tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  // Mock window.alert for each test
  window.alert = jest.fn();
});

afterEach(() => {
  // Clean up any mocks after each test
  jest.clearAllMocks();
});

afterAll(() => {
  // Restore all mocks and original functions
  window.alert = originalAlert;
  jest.restoreAllMocks();
});

describe('NewCustomerForm Component', () => {
  it('renders all customer fields', () => {
    render(<NewCustomerForm {...baseProps} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Sector/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Social Handle/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Customer/i })).toBeInTheDocument();
  });

  it('handles input and submit when required fields are filled', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Private' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'VIP customer' } });
    fireEvent.change(screen.getByLabelText(/Social Handle/i), { target: { value: '@johndoe' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(
      screen.getByText((content, element) =>
        typeof content === 'string' && content.indexOf('Customer John Doe (john@example.com) added successfully') !== -1
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Company/i)).toHaveValue('');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('');
    expect(screen.getByLabelText(/Customer Sector/i)).toHaveValue('');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('');
    expect(screen.getByLabelText(/Social Handle/i)).toHaveValue('');
  });

  it('shows error message only for missing field when submitting blank form', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Name is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBeGreaterThan(0);
  });

  it('shows error for social handle not starting with @', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/Social Handle/i), { target: { value: 'johndoe' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Social handle must start with @/i).length).toBeGreaterThan(0);
  });

  it('shows error message only for missing Name', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Name is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBe(0);
  });

  it('shows error message only for missing Email', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Email is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Name is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Company is required/i).length).toBe(0);
  });

  it('shows error message only for missing Company', () => {
    render(<NewCustomerForm {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    expect(screen.queryAllByText(/Company is required/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Name is required/i).length).toBe(0);
    expect(screen.queryAllByText(/Email is required/i).length).toBe(0);
  });

  it('shows NDA checkbox only when Government sector is selected', () => {
    render(<NewCustomerForm {...baseProps} />);
    
    // Initially, NDA checkbox should not be visible
    expect(screen.queryByLabelText(/Requires NDA/i)).not.toBeInTheDocument();

    // Select Government sector
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Government' } });
    
    // Now NDA checkbox should be visible
    expect(screen.getByLabelText(/Requires NDA/i)).toBeInTheDocument();

    // Select Private sector
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Private' } });
    
    // NDA checkbox should be hidden again
    expect(screen.queryByLabelText(/Requires NDA/i)).not.toBeInTheDocument();
  });

  it('resets NDA checkbox when sector changes', () => {
    render(<NewCustomerForm {...baseProps} />);
    
    // Select Government sector and check NDA
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Government' } });
    const ndaCheckbox = screen.getByLabelText(/Requires NDA/i);
    fireEvent.click(ndaCheckbox);
    expect(ndaCheckbox).toBeChecked();

    // Change to Private sector and back to Government
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Private' } });
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Government' } });
    
    // NDA checkbox should be unchecked
    const newNdaCheckbox = screen.getByLabelText(/Requires NDA/i);
    expect(newNdaCheckbox).not.toBeChecked();
  });

  it('submits customer with NDA true only for Government sector', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<NewCustomerForm {...baseProps} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Acme Corp' } });

    // Test with Government sector and NDA checked
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Government' } });
    fireEvent.click(screen.getByLabelText(/Requires NDA/i));
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    
    expect(consoleSpy).toHaveBeenCalledWith('Customer data:', expect.objectContaining({
      sector: 'Government',
      requiresNDA: true
    }));

    consoleSpy.mockClear();

    // Fill required fields again
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company/i), { target: { value: 'Another Corp' } });

    // Test with Private sector (NDA should be false even if it was checked before)
    fireEvent.change(screen.getByLabelText(/Customer Sector/i), { target: { value: 'Private' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));
    
    expect(consoleSpy).toHaveBeenCalledWith('Customer data:', expect.objectContaining({
      sector: 'Private',
      requiresNDA: false
    }));

    consoleSpy.mockRestore();
  });

  it('displays environment badge when environment is TEST', () => {
    render(<NewCustomerForm {...baseProps} />);
    const badge = screen.getByTestId('environment-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('TEST');
  });

  it('does not display badge in PROD environment', () => {
    const prodProps = { ...baseProps, environment: 'PROD' };
    render(<NewCustomerForm {...prodProps} />);
    expect(screen.queryByTestId('environment-badge')).not.toBeInTheDocument();
  });

  it('does not display environment badge when environment is not provided', () => {
    const propsWithoutEnvironment = { userDisplayName: 'Test User', environment: '' };
    render(<NewCustomerForm {...propsWithoutEnvironment} />);
    expect(screen.queryByTestId('environment-badge')).not.toBeInTheDocument();
  });

  it('displays environment badge for other non-PROD environments', () => {
    const stagingProps = { ...baseProps, environment: 'STAGING' };
    render(<NewCustomerForm {...stagingProps} />);
    const badge = screen.getByTestId('environment-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('STAGING');
  });
});
