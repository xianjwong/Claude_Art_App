// src/__tests__/MovementBar.test.tsx
// Tests for MovementBar component

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovementBar from '../components/MovementBar';
import { Movement, TimePeriod } from '../types';

describe('MovementBar', () => {
  const mockMovement: Movement = {
    id: 'test-movement',
    name: 'Test Movement',
    period: { start: 1500, end: 1600 },
    description: 'A test art movement',
    shortDescription: 'Test movement',
    color: '#FF6347',
    region: 'Test Region',
  };

  const mockTimeRange: TimePeriod = {
    start: 1400,
    end: 1920,
  };

  const defaultProps = {
    movement: mockMovement,
    timeRange: mockTimeRange,
    columnIndex: 0,
  };

  it('should render without crashing', () => {
    const { getByTestId } = render(<MovementBar {...defaultProps} />);
    expect(getByTestId('movement-bar-test-movement')).toBeTruthy();
  });

  it('should display movement name, period, and short description by default', () => {
    const { getByText } = render(<MovementBar {...defaultProps} />);
    expect(getByText('Test Movement')).toBeTruthy();
    expect(getByText('1500 - 1600')).toBeTruthy();
    expect(getByText('Test movement')).toBeTruthy();
  });

  it('should hide label when showLabel is false', () => {
    const { queryByText } = render(
      <MovementBar {...defaultProps} showLabel={false} />
    );
    expect(queryByText('Test Movement')).toBeNull();
    expect(queryByText('1500 - 1600')).toBeNull();
    expect(queryByText('Test movement')).toBeNull();
  });

  it('should handle onPress callback', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <MovementBar {...defaultProps} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('movement-bar-test-movement'));
    expect(mockOnPress).toHaveBeenCalledWith(mockMovement);
  });

  it('should apply correct background color from movement', () => {
    const { getByTestId } = render(<MovementBar {...defaultProps} />);
    const colorBar = getByTestId('movement-bar-test-movement');

    expect(colorBar.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: '#FF6347',
      })
    );
  });

  it('should position wrapper based on column index', () => {
    const { getByTestId } = render(
      <MovementBar {...defaultProps} columnIndex={2} />
    );
    const wrapper = getByTestId('movement-wrapper-test-movement');

    // Should be offset by (20 + 30) * 2 = 100 pixels for column 2
    expect(wrapper.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          left: 100,
        })
      ])
    );
  });

  it('should handle single-year movements', () => {
    const singleYearMovement: Movement = {
      ...mockMovement,
      period: { start: 1900 }, // No end year
    };

    const { getByText } = render(
      <MovementBar {...defaultProps} movement={singleYearMovement} />
    );

    expect(getByText('1900')).toBeTruthy();
  });

  it('should not crash when onPress is not provided', () => {
    const { getByTestId } = render(<MovementBar {...defaultProps} />);

    expect(() => {
      fireEvent.press(getByTestId('movement-bar-test-movement'));
    }).not.toThrow();
  });

  it('should accept custom bar width', () => {
    const { getByTestId } = render(
      <MovementBar {...defaultProps} barWidth={40} />
    );
    const colorBar = getByTestId('movement-bar-test-movement');

    expect(colorBar.props.style).toEqual(
      expect.objectContaining({
        width: 40,
      })
    );
  });

  it('should show color bar as a narrow vertical bar', () => {
    const { getByTestId } = render(<MovementBar {...defaultProps} />);
    const colorBar = getByTestId('movement-bar-test-movement');

    expect(colorBar.props.style).toEqual(
      expect.objectContaining({
        width: 20, // Default bar width
      })
    );
  });
});