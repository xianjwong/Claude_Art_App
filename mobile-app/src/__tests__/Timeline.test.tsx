// src/__tests__/Timeline.test.tsx
// Tests for Timeline component

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Timeline from '../components/Timeline';
import { Movement, TimePeriod } from '../types';

describe('Timeline', () => {
  const mockMovements: Movement[] = [
    {
      id: 'renaissance',
      name: 'Renaissance',
      period: { start: 1400, end: 1600 },
      description: 'Renaissance period',
      shortDescription: 'Renaissance',
      color: '#8B4513',
    },
    {
      id: 'baroque',
      name: 'Baroque',
      period: { start: 1600, end: 1750 },
      description: 'Baroque period',
      shortDescription: 'Baroque',
      color: '#800080',
    },
    {
      id: 'romanticism',
      name: 'Romanticism',
      period: { start: 1800, end: 1850 },
      description: 'Romantic period',
      shortDescription: 'Romanticism',
      color: '#DC143C',
    },
  ];

  const mockTimeRange: TimePeriod = {
    start: 1400,
    end: 1920,
  };

  const defaultProps = {
    movements: mockMovements,
    timeRange: mockTimeRange,
  };

  it('should render without crashing', () => {
    const { getByTestId } = render(<Timeline {...defaultProps} />);
    expect(getByTestId('timeline-container')).toBeTruthy();
    expect(getByTestId('timeline-scroll-view')).toBeTruthy();
  });

  it('should render all movement bars', () => {
    const { getByTestId } = render(<Timeline {...defaultProps} />);

    expect(getByTestId('movement-bar-renaissance')).toBeTruthy();
    expect(getByTestId('movement-bar-baroque')).toBeTruthy();
    expect(getByTestId('movement-bar-romanticism')).toBeTruthy();
  });

  it('should show time indicator by default', () => {
    const { getByTestId } = render(<Timeline {...defaultProps} />);
    expect(getByTestId('time-indicator')).toBeTruthy();
  });

  it('should hide time indicator when showTimeIndicator is false', () => {
    const { queryByTestId } = render(
      <Timeline {...defaultProps} showTimeIndicator={false} />
    );
    expect(queryByTestId('time-indicator')).toBeNull();
  });

  it('should position time indicator at top by default', () => {
    const { getByTestId } = render(<Timeline {...defaultProps} />);
    const timeIndicator = getByTestId('time-indicator');

    expect(timeIndicator.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          top: 60,
        })
      ])
    );
  });

  it('should position time indicator at bottom when specified', () => {
    const { getByTestId } = render(
      <Timeline {...defaultProps} timeIndicatorPosition="bottom" />
    );
    const timeIndicator = getByTestId('time-indicator');

    expect(timeIndicator.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          bottom: 100,
        })
      ])
    );
  });

  it('should handle movement press events', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Timeline {...defaultProps} onMovementPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('movement-bar-renaissance'));
    expect(mockOnPress).toHaveBeenCalledWith(mockMovements[0]);
  });

  it('should apply zoom scaling to bar width', () => {
    const { getByTestId } = render(
      <Timeline {...defaultProps} zoomLevel={2} />
    );

    const movementBar = getByTestId('movement-bar-renaissance');
    expect(movementBar.props.style).toEqual(
      expect.objectContaining({
        width: 40, // 20 * 2 zoom level
      })
    );
  });

  it('should handle empty movements array', () => {
    const { getByTestId, queryByTestId } = render(
      <Timeline {...defaultProps} movements={[]} />
    );

    expect(getByTestId('timeline-container')).toBeTruthy();
    expect(queryByTestId('movement-bar-renaissance')).toBeNull();
  });

  it('should handle single movement', () => {
    const singleMovement = [mockMovements[0]];
    const { getByTestId } = render(
      <Timeline {...defaultProps} movements={singleMovement} />
    );

    expect(getByTestId('movement-bar-renaissance')).toBeTruthy();
    expect(getByTestId('timeline-container')).toBeTruthy();
  });

  it('should update visible range on scroll', () => {
    const { getByTestId } = render(<Timeline {...defaultProps} />);
    const scrollView = getByTestId('timeline-scroll-view');

    // Simulate scroll event
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 200 },
      },
    });

    // The component should handle the scroll without crashing
    expect(getByTestId('time-indicator')).toBeTruthy();
  });

  it('should handle different zoom levels', () => {
    const { rerender, getByTestId } = render(
      <Timeline {...defaultProps} zoomLevel={1} />
    );

    let movementBar = getByTestId('movement-bar-renaissance');
    expect(movementBar.props.style).toEqual(
      expect.objectContaining({
        width: 20, // 20 * 1 zoom level
      })
    );

    rerender(<Timeline {...defaultProps} zoomLevel={0.5} />);

    movementBar = getByTestId('movement-bar-renaissance');
    expect(movementBar.props.style).toEqual(
      expect.objectContaining({
        width: 10, // 20 * 0.5 zoom level
      })
    );
  });

  it('should handle overlapping movements correctly', () => {
    const overlappingMovements: Movement[] = [
      {
        id: 'movement1',
        name: 'Movement 1',
        period: { start: 1500, end: 1700 },
        description: 'First movement',
        shortDescription: 'Movement 1',
        color: '#FF0000',
      },
      {
        id: 'movement2',
        name: 'Movement 2',
        period: { start: 1600, end: 1800 },
        description: 'Second movement',
        shortDescription: 'Movement 2',
        color: '#00FF00',
      },
    ];

    const { getByTestId } = render(
      <Timeline {...defaultProps} movements={overlappingMovements} />
    );

    // Both movements should render
    expect(getByTestId('movement-bar-movement1')).toBeTruthy();
    expect(getByTestId('movement-bar-movement2')).toBeTruthy();

    // They should be in different columns (different left positions)
    const wrapper1 = getByTestId('movement-wrapper-movement1');
    const wrapper2 = getByTestId('movement-wrapper-movement2');

    const style1 = Array.isArray(wrapper1.props.style) ? wrapper1.props.style : [wrapper1.props.style];
    const style2 = Array.isArray(wrapper2.props.style) ? wrapper2.props.style : [wrapper2.props.style];

    const left1 = style1.find(s => s && typeof s === 'object' && 'left' in s)?.left || 0;
    const left2 = style2.find(s => s && typeof s === 'object' && 'left' in s)?.left || 0;

    expect(left1).not.toEqual(left2);
  });
});