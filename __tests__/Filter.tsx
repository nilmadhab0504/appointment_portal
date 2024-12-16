import { render, screen, fireEvent } from '@testing-library/react';
import { Filters } from '../src/components/AppointmentFilter';
import { useData } from '@/context/dataContext';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('@/context/dataContext', () => ({
  useData: jest.fn(),
}));

const setCurrentPageMock = jest.fn();

describe('Filters Component', () => {
  const mockSetFilterOptions = jest.fn();
  const mockFilterOptions = {
    search: '',
    startDate: '',
    endDate: '',
    status: 'all',
  };

  beforeEach(() => {
    (useData as jest.Mock).mockReturnValue({
      filterOptions: mockFilterOptions,
      setFilterOptions: mockSetFilterOptions,
    });
    mockSetFilterOptions.mockClear();
    setCurrentPageMock.mockClear();
  });

  test('renders filter options correctly', () => {
    render(<Filters setCurrentPage={setCurrentPageMock} />);
    expect(screen.getByTestId('appointment-filter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search appointments by name')).toBeInTheDocument();
    expect(screen.getByTestId('start-date-button')).toHaveTextContent('Select start date');
    expect(screen.getByTestId('end-date-button')).toHaveTextContent('Select end date');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('updates search input value and calls setFilterOptions', () => {
    render(<Filters setCurrentPage={setCurrentPageMock} />);
    const searchInput = screen.getByPlaceholderText('Search appointments by name');
    
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput).toHaveValue('test search');
    expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
    const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
    const newFilterOptions = setFilterOptionsCall({ search: '' });
    
    expect(newFilterOptions).toEqual(expect.objectContaining({ search: 'test search' }));
    expect(setCurrentPageMock).toHaveBeenCalledWith(1);
  });
  
 
  test('renders selected start date if filterOptions.startDate is set', () => {
    const startDate = new Date(2024, 11, 25).toISOString();
    (useData as jest.Mock).mockReturnValue({
      filterOptions: { ...mockFilterOptions, startDate },
      setFilterOptions: mockSetFilterOptions,
    });

    render(<Filters setCurrentPage={setCurrentPageMock} />);

    expect(screen.getByTestId('start-date-button')).toHaveTextContent(
      format(parseISO(startDate), 'MM/dd/yyyy')
    );
  });

  test('renders selected end date if filterOptions.endDate is set', () => {
    const endDate = new Date(2024, 11, 30).toISOString();
    (useData as jest.Mock).mockReturnValue({
      filterOptions: { ...mockFilterOptions, endDate },
      setFilterOptions: mockSetFilterOptions,
    });

    render(<Filters setCurrentPage={setCurrentPageMock} />);

    expect(screen.getByTestId('end-date-button')).toHaveTextContent(
      format(parseISO(endDate), 'MM/dd/yyyy')
    );
  });

  test('calls setFilterOptions and setCurrentPage when search term changes', () => {
    render(<Filters setCurrentPage={setCurrentPageMock} />);

    const searchInput = screen.getByPlaceholderText('Search appointments by name');
    fireEvent.change(searchInput, { target: { value: 'new search term' } });

    expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
    const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
    const newFilterOptions = setFilterOptionsCall({ search: '' });
    
    expect(newFilterOptions).toEqual(expect.objectContaining({ search: 'new search term' }));
    expect(setCurrentPageMock).toHaveBeenCalledWith(1);
  });

 

  test('calls setFilterOptions when start date is selected', () => {
    render(<Filters setCurrentPage={setCurrentPageMock} />);

    const startDateButton = screen.getByTestId('start-date-button');
    fireEvent.click(startDateButton);

    const selectedDate = new Date(2024, 11, 16); // Note: month is 0-indexed
    const dayButton = screen.getByText(selectedDate.getDate().toString());
    fireEvent.click(dayButton);

    expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
    const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
    const newFilterOptions = setFilterOptionsCall({});
    
    expect(newFilterOptions).toHaveProperty('startDate', selectedDate.toISOString());
  });

  test('calls setFilterOptions when end date is selected', () => {
    render(<Filters setCurrentPage={setCurrentPageMock} />);

    const endDateButton = screen.getByTestId('end-date-button');
    fireEvent.click(endDateButton);

    const selectedDate = new Date(2024, 11, 16);
    const dayButton = screen.getByText(selectedDate.getDate().toString());
    fireEvent.click(dayButton);

    expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
    const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
    const newFilterOptions = setFilterOptionsCall({});
    
    expect(newFilterOptions).toHaveProperty('endDate', selectedDate.toISOString());
  });




 
  // test('updates status when an option is selected', async () => {
  //   render(<Filters setCurrentPage={setCurrentPageMock} />);
  
  //   // Find the status select button
  //   const statusSelectButton = screen.getByRole('combobox');
  
  //   // Open the dropdown
  //   fireEvent.mouseDown(statusSelectButton);
  
  //   // Wait for and click the Urgent option
  //   const urgentOption = await screen.findByRole('option', { name: 'Urgent' });
  //   fireEvent.click(urgentOption);
  
  //   // Verify the status change
  //   expect(mockSetFilterOptions).toHaveBeenCalledTimes(1); // Ensure it's called once
    
  //   const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
    
  //   // Now call the function to get the new filter options
  //   const newFilterOptions = setFilterOptionsCall({ status: 'all' });
  
  //   // Check if the status was updated to 'Urgent'
  //   expect(newFilterOptions).toEqual(expect.objectContaining({ status: 'Urgent' }));
  // });
  

  // test('updates start date when a date is selected', () => {
  //   render(<Filters setCurrentPage={setCurrentPageMock} />);

  //   const startDateButton = screen.getByTestId('start-date-button');
  //   fireEvent.click(startDateButton);

  //   const date = new Date(2024, 11, 25); // Note: month is 0-indexed
  //   const dayButton = screen.getByText(date.getDate().toString());
  //   fireEvent.click(dayButton);

  //   expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
  //   const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
  //   const newFilterOptions = setFilterOptionsCall({});
    
  //   expect(newFilterOptions).toHaveProperty('startDate', date.toISOString());
  //   expect(screen.queryByText('Select start date')).not.toBeInTheDocument();
  // });

  // test('updates end date when a date is selected', () => {
  //   render(<Filters setCurrentPage={setCurrentPageMock} />);

  //   const endDateButton = screen.getByTestId('end-date-button');
  //   fireEvent.click(endDateButton);

  //   const date = new Date(2024, 11, 30); // Note: month is 0-indexed
  //   const dayButton = screen.getByText(date.getDate().toString());
  //   fireEvent.click(dayButton);

  //   expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
  //   const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
  //   const newFilterOptions = setFilterOptionsCall({});
    
  //   expect(newFilterOptions).toHaveProperty('endDate', date.toISOString());
  //   expect(screen.queryByText('Select end date')).not.toBeInTheDocument();
  // });

  // test('calls setFilterOptions when status is changed to Emergency', async () => {
  //   render(<Filters setCurrentPage={setCurrentPageMock} />);

  //   // Find the status select button
  //   const statusSelectButton = screen.getByRole('combobox');
    
  //   // Open the dropdown
  //   fireEvent.click(statusSelectButton);

  //   // Wait for and click the Emergency option
  //   const emergencyOption = await screen.findByText('Emergency');
  //   fireEvent.click(emergencyOption);

  //   // Verify the status change
  //   expect(mockSetFilterOptions).toHaveBeenCalledWith(expect.any(Function));
    
  //   const setFilterOptionsCall = mockSetFilterOptions.mock.calls[0][0];
  //   const newFilterOptions = setFilterOptionsCall({ status: 'all' });
    
  //   expect(newFilterOptions).toEqual(expect.objectContaining({ status: 'Emergency' }));
  // });
});