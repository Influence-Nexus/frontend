/* eslint-disable import/first */
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

let testUuid = '';
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ uuid: testUuid }) };
});

vi.mock('../../../CustomStates', () => ({ useCustomStates: vi.fn() }));
vi.mock('../en/Table.jsx', () => ({ MovesTable: () => <div /> }));
vi.mock('../en/TableHuge.jsx', () => ({ TableHuge: () => <div /> }));
vi.mock('../en/TableSmall.jsx', () => ({ TableSmall: () => <div /> }));
vi.mock('../en/ScienceGraphComp.jsx', () => ({
  ScienceGraphComponent: () => <div />,
}));
vi.mock('../../ChallengeYourMindText/ChallengeYourMindText.jsx', () => ({
  ChallengeYourMindText: () => <div />,
}));
vi.mock('../en/Conditions.jsx', () => ({ Conditions: () => <div /> }));
vi.mock('../en/SciencePageButtons.jsx', () => ({
  SciencePageButtons: () => <div />,
}));
vi.mock('../en/ScienceStopWatchContainer.jsx', () => ({
  ScienceStopWatchContainer: () => <div />,
}));
vi.mock('../../Cat/CatAnimation.jsx', () => ({ default: () => <div /> }));

vi.mock('../../../clientServerHub', () => ({
  getMatrixByUUID: vi.fn(),
  fetchScienceDataByUUID: vi.fn(),
  logScienceQuery: vi.fn(),
}));

import SciencePageEN from '../en/SciencePageEN.jsx';
import { useCustomStates } from '../../../CustomStates';
import {
  getMatrixByUUID,
  fetchScienceDataByUUID,
} from '../../../clientServerHub';

const useCustomStatesMock = useCustomStates;

describe('SciencePageEN', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('filters cards by uuid and sets header color', async () => {
    testUuid = '6e85f59b-2a46-44b5-9b5a-31f572504622';

    const setIsLoading = vi.fn();
    const setError = vi.fn();

    useCustomStatesMock.mockReturnValue({
      smallTableData: [],
      setSmallTableData: vi.fn(),
      hugeTableData: [],
      setHugeTableData: vi.fn(),
      syntheticData: [],
      setSyntheticData: vi.fn(),
      matrixInfo: { matrix_info: { uuid: testUuid } },
      setMatrixInfo: vi.fn(),
      isLoading: false,
      setIsLoading,
      error: null,
      setError,
      showCat: false,
      setShowCat: vi.fn(),
      currentTime: 0,
      catAnimationLaunched: false,
      setCatAnimationLaunched: vi.fn(),
      maxTime: 100,
      graphData: null,
      setGraphData: vi.fn(),
      userUuid: 'user-123',
    });

    getMatrixByUUID.mockResolvedValue({
      nodes: [],
      edges: [],
      matrix_info: { uuid: testUuid },
    });

    fetchScienceDataByUUID.mockResolvedValue({
      x: [1],
      u: [1],
      normalized_x: [1],
      normalized_u: [1],
      sorted_true_seq: [[1, 1]],
      synthetic_data: [],
    });

    render(<SciencePageEN />);

    await waitFor(() => expect(getMatrixByUUID).toHaveBeenCalled());
    await waitFor(() => expect(fetchScienceDataByUUID).toHaveBeenCalled());
    await waitFor(() => expect(setIsLoading).toHaveBeenLastCalledWith(false));
    await waitFor(() => expect(setError).toHaveBeenLastCalledWith(null));

    const header = screen.getByRole('heading', { level: 1 });
    expect(header).toHaveClass('header-green');
    expect(header).toHaveTextContent('Carbon sequestration');
  });

  test('handles getMatrixByUUID error', async () => {
    testUuid = '6e85f59b-2a46-44b5-9b5a-31f572504622';

    const setIsLoading = vi.fn();
    const setError = vi.fn();

    useCustomStatesMock.mockReturnValue({
      smallTableData: [],
      setSmallTableData: vi.fn(),
      hugeTableData: [],
      setHugeTableData: vi.fn(),
      syntheticData: [],
      setSyntheticData: vi.fn(),
      matrixInfo: null,
      setMatrixInfo: vi.fn(),
      isLoading: false,
      setIsLoading,
      error: null,
      setError,
      showCat: false,
      setShowCat: vi.fn(),
      currentTime: 0,
      catAnimationLaunched: false,
      setCatAnimationLaunched: vi.fn(),
      maxTime: 100,
      graphData: null,
      setGraphData: vi.fn(),
      userUuid: 'user-123',
    });

    getMatrixByUUID.mockRejectedValue(new Error('fail'));

    render(<SciencePageEN />);

    await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(true));
    await waitFor(() => expect(setIsLoading).toHaveBeenLastCalledWith(false));
    await waitFor(() =>
      expect(setError).toHaveBeenCalledWith('Ошибка загрузки матрицы')
    );
    expect(fetchScienceDataByUUID).not.toHaveBeenCalled();
  });

  test('handles fetchScienceDataByUUID error', async () => {
    testUuid = '6e85f59b-2a46-44b5-9b5a-31f572504622';

    const setIsLoading = vi.fn();
    const setError = vi.fn();

    useCustomStatesMock.mockReturnValue({
      smallTableData: [],
      setSmallTableData: vi.fn(),
      hugeTableData: [],
      setHugeTableData: vi.fn(),
      syntheticData: [],
      setSyntheticData: vi.fn(),
      matrixInfo: { matrix_info: { uuid: testUuid } },
      setMatrixInfo: vi.fn(),
      isLoading: false,
      setIsLoading,
      error: null,
      setError,
      showCat: false,
      setShowCat: vi.fn(),
      currentTime: 0,
      catAnimationLaunched: false,
      setCatAnimationLaunched: vi.fn(),
      maxTime: 100,
      graphData: null,
      setGraphData: vi.fn(),
      userUuid: 'user-123',
    });

    getMatrixByUUID.mockResolvedValue({
      nodes: [],
      edges: [],
      matrix_info: { uuid: testUuid },
    });

    fetchScienceDataByUUID.mockRejectedValue(new Error('fail'));

    render(<SciencePageEN />);

    await waitFor(() => expect(fetchScienceDataByUUID).toHaveBeenCalled());
    await waitFor(() => expect(setIsLoading).toHaveBeenLastCalledWith(false));
    await waitFor(() =>
      expect(setError).toHaveBeenLastCalledWith(
        'Ошибка загрузки аналитических данных'
      )
    );
  });
});
