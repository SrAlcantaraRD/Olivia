import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mocks for internal hooks. Declare variables that the jest.mock factories will close over.
let mockActiveExecute: jest.Mock | undefined;
let mockActiveItems: Array<Record<string, unknown>> | undefined;
let mockStatsExecute: jest.Mock | undefined;
let mockStatsItems: Array<Record<string, unknown>> | undefined;
let mockTrendExecute: jest.Mock | undefined;
let mockTrendItems: Array<Record<string, unknown>> | undefined;

jest.mock('@/domain/module/hook/get-list-active-module.hook', () => ({
  useGetListActiveModule: () => ({
    isExecuting: false,
    execute: mockActiveExecute ?? (async () => ({})),
    items: mockActiveItems ?? [],
  }),
}));

jest.mock('@/domain/module/hook/get-record-statistics.hook', () => ({
  useGetRecordStatistics: () => ({
    execute: mockStatsExecute ?? (async () => ({})),
    items: mockStatsItems ?? [],
  }),
}));

jest.mock('@/domain/module/hook/get-record-trend.hook', () => ({
  useGetRecordTrend: () => ({
    execute: mockTrendExecute ?? (async () => ({})),
    items: mockTrendItems ?? [],
  }),
}));

// Now import the hook under test (after mocks)
import { useReportManager } from '@/hooks/use-report-manager.hook';

describe('useReportManager (integration-ish)', () => {
  beforeEach(() => {
    mockActiveExecute = undefined;
    mockActiveItems = undefined;
    mockStatsExecute = undefined;
    mockStatsItems = undefined;
    mockTrendExecute = undefined;
    mockTrendItems = undefined;
  });

  function makeAdapters() {
    return {
      loggerAdapter: {} as Record<string, unknown>,
      recordAdapter: {} as Record<string, unknown>,
      moduleAdapter: {} as Record<string, unknown>,
      notifyAdapter: {
        error: jest.fn(),
        success: jest.fn(),
        info: jest.fn(),
      } as {
        error: jest.Mock;
        success: jest.Mock;
        info: jest.Mock;
      },
    };
  }

  it('loads modules, stats and trend on mount', async () => {
    mockActiveItems = [{ id: 1, isActive: true, name: 'M1' }];
    mockActiveExecute = jest.fn().mockResolvedValue({ success: true });

    mockStatsItems = [{ moduleID: 1, count: 2 }];
    mockStatsExecute = jest.fn().mockResolvedValue({
      success: true,
      details: { countsByModule: mockStatsItems },
    });

    mockTrendItems = [{ day: '2025-12-01', count: 3 }];
    mockTrendExecute = jest.fn().mockResolvedValue({
      success: true,
      details: { series: mockTrendItems },
    });

    const adapters = makeAdapters();

    // Component that exposes the hook result to a module-scoped variable on each render
    let reported: ReportManagerResult | null = null;
    function TestComp() {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const r = useReportManager(adapters);
      reported = r as unknown as ReportManagerResult;
      return null;
    }

    await act(async () => {
      renderer.create(React.createElement(TestComp));
      // wait a tick for effects
      await Promise.resolve();
    });

    expect(reported).toBeDefined();
    const rep = reported as ReportManagerResult;
    expect(rep.visibleModules.length).toBe(1);
    expect(mockActiveExecute).toHaveBeenCalled();
    expect(mockStatsExecute).toHaveBeenCalled();
    expect(mockTrendExecute).toHaveBeenCalled();
  });

  it('notifies on stats error', async () => {
    mockActiveItems = [{ id: 1, isActive: true, name: 'M1' }];
    mockActiveExecute = jest.fn().mockResolvedValue({ success: true });

    mockStatsExecute = jest.fn().mockRejectedValue(new Error('db'));
    mockTrendExecute = jest
      .fn()
      .mockResolvedValue({ success: true, details: { series: [] } });

    const adapters = makeAdapters();

    let reported: ReportManagerResult | null = null;
    function TestComp() {
      const r = useReportManager(adapters);
      reported = r as unknown as ReportManagerResult;
      return null;
    }

    await act(async () => {
      renderer.create(React.createElement(TestComp));
      await Promise.resolve();
    });

    expect(reported).toBeDefined();
    const rep2 = reported as ReportManagerResult;
    // notifyAdapter.error should be called because executeGetStats rejected
    expect(adapters.notifyAdapter.error).toHaveBeenCalled();
  });

  it('refreshModule updates trendByModule', async () => {
    mockActiveItems = [{ id: 2, isActive: true, name: 'M2' }];
    mockActiveExecute = jest.fn().mockResolvedValue({ success: true });

    mockStatsItems = [];
    mockStatsExecute = jest
      .fn()
      .mockResolvedValue({ success: true, details: { countsByModule: [] } });

    mockTrendExecute = jest.fn().mockResolvedValue({
      success: true,
      details: {
        series: [{ day: new Date().toISOString().slice(0, 10), count: 5 }],
      },
    });

    const adapters = makeAdapters();
    let reported: ReportManagerResult | null = null;

    function TestComp() {
      const r = useReportManager(adapters);
      reported = r as unknown as ReportManagerResult;
      return null;
    }

    await act(async () => {
      renderer.create(React.createElement(TestComp));
      await Promise.resolve();
    });

    expect(reported).toBeDefined();

    // call refreshModule and ensure trendByModule updated
    await act(async () => {
      await (reported as ReportManagerResult).refreshModule(2);
      await Promise.resolve();
    });

    const series = (reported as ReportManagerResult).trendByModule[2];
    expect(Array.isArray(series)).toBe(true);
    expect(series.length).toBeGreaterThanOrEqual(1);
  });
});
