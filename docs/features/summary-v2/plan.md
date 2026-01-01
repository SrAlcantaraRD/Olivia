# Plan: Simplify Summary Feature (RecordField Centric)

## Objective
Refactor the `summary` feature to abandon specialized/complex implementations and make `RecordField` the atomic unit of data. This allows the UI to autonomously consume a single, flexible use-case to build any summary view (Trends, History, Highlights) by grouping `RecordField`s on demand.

## Problem Statement
The current `src/app/(tabs)/summary` implementation is over-complex:
- Rigid, specialized adapters/hooks tied to specific views (Highlights, Trends, etc.)
- Components lack autonomy; they don't directly consume use-cases via hooks
- Complex prop-drilling and data transformation logic scattered across UI
- Multiple specialized summary use-cases that duplicate grouping logic
- Existing `GetRecordFieldListUseCase` is too limited (only fetches by `fieldID`)

---

## Core Concept

### RecordField as Atomic Unit
Every piece of data in the app is a `RecordField`. A `RecordField` contains:
- `id`: Unique identifier
- `recordID`: Which record (event) it belongs to
- `fieldID`: Which module field it represents
- `value`: The actual data value
- `createdAt`: When it was created
- Relations: `record` (with `moduleID`, `carerID`), `moduleField` (with `moduleId`, `code`, `type`, etc.)
„
### Grouping Dimensions
We can group `RecordField`s by:
1. **By Module** (`moduleID`): "Show me all fields from URINE module"
2. **By Field** (`fieldID`): "Show me all 'volume' field values"
3. **By Time** (`createdAt`): "Show me fields created in the last 7 days"
4. **By Record** (`recordID`): "Show me all fields from a specific record/event"
5. **By Value**: "Show me distribution of values"

### Period-Based Aggregation
Using `SUMMARY_PERIOD_ENUM`, we aggregate data differently:
- `DAY`: Hourly buckets (24 bars, 0-23h)
- `WEEK`: Daily buckets (7 bars, Mon-Sun)
- `MONTH`: Daily buckets (30 bars, last 30 days)
- `HALF_YEAR`: Weekly buckets (24 bars, last 24 weeks)
- `YEAR`: Monthly buckets (12 bars, Jan-Dec)

---

## Domain Architecture

### 1. Enhanced RecordField Entity
The existing `RecordField` entity already has what we need. We'll leverage its relations:

```typescript
// src/domain/module/entity/record-field.entity.ts
export type TRecordField = z.infer<typeof RecordFieldSchema> & {
  record?: TRecord;        // Has moduleID, carerID, createdAt
  moduleField?: TModuleField; // Has moduleId, code, type, description
};
```

### 2. New Summary DTOs (Data Transfer Objects)

#### Base Grouped Data Structure
```typescript
// src/domain/summary/dto/grouped-record-fields.dto.ts

export type TGroupedRecordFieldsBase = {
  period: SUMMARY_PERIOD_ENUM;
  buckets: TTimeBucket[];
  metadata: {
    totalCount: number;
    uniqueRecords: number;
    dateRange: {
      from: Date;
      to: Date;
    };
  };
};

export type TTimeBucket = {
  label: string;           // "08:00", "Monday", "Jan", etc.
  value: number;           // Count of RecordFields in this bucket
  timestamp: Date;         // Bucket start time
  recordFields?: TRecordField[]; // Optional: raw data for detail views
};
```

#### Period-Specific Result Types
```typescript
// src/domain/summary/dto/summary-period-results.dto.ts

export type TDaySummaryResult = TGroupedRecordFieldsBase & {
  period: SUMMARY_PERIOD_ENUM.DAY;
  buckets: (TTimeBucket & { hour: number })[];
};

export type TWeekSummaryResult = TGroupedRecordFieldsBase & {
  period: SUMMARY_PERIOD_ENUM.WEEK;
  buckets: (TTimeBucket & { dayOfWeek: number })[];
};

export type TMonthSummaryResult = TGroupedRecordFieldsBase & {
  period: SUMMARY_PERIOD_ENUM.MONTH;
  buckets: (TTimeBucket & { dayOfMonth: number })[];
};

export type THalfYearSummaryResult = TGroupedRecordFieldsBase & {
  period: SUMMARY_PERIOD_ENUM.HALF_YEAR;
  buckets: (TTimeBucket & { weekNumber: number })[];
};

export type TYearSummaryResult = TGroupedRecordFieldsBase & {
  period: SUMMARY_PERIOD_ENUM.YEAR;
  buckets: (TTimeBucket & { month: number })[];
};

// Union type for type safety
export type TSummaryPeriodResult =
  | TDaySummaryResult
  | TWeekSummaryResult
  | TMonthSummaryResult
  | THalfYearSummaryResult
  | TYearSummaryResult;
```

#### Module Summary DTO
```typescript
// src/domain/summary/dto/module-summary.dto.ts

export type TModuleSummary = {
  module: TModule;
  groupedData: TSummaryPeriodResult;
  statistics: {
    currentPeriodTotal: number;
    previousPeriodTotal: number;
    percentageChange: number;
    lastRecordedAt: Date | null;
  };
};
```

#### Field Summary DTO
```typescript
// src/domain/summary/dto/field-summary.dto.ts

export type TFieldSummary = {
  moduleField: TModuleField;
  module: TModule;
  groupedData: TSummaryPeriodResult;
  distribution?: {
    value: string;
    count: number;
    percentage: number;
  }[];
  statistics: {
    currentPeriodTotal: number;
    previousPeriodTotal: number;
    averageValue: number | null;
    mostCommonValue: string | null;
  };
};
```

### 3. Updated Ports

```typescript
// src/domain/summary/port/summary-grouping.port.ts

export interface ISummaryGroupingPort {
  /**
   * Get RecordFields grouped by module and period
   */
  getModuleSummary(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID; // Optional filter
  }): Promise<TModuleSummary>;

  /**
   * Get RecordFields grouped by specific field and period
   */
  getFieldSummary(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TFieldSummary>;

  /**
   * Get multiple modules summary (for home screen)
   */
  getModulesSummary(params: {
    moduleIds: TID[];
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TModuleSummary[]>;

  /**
   * Get raw RecordFields with filters
   */
  getRecordFields(params: {
    moduleId?: TID;
    fieldId?: TID;
    recordId?: TID;
    dateFrom?: Date;
    dateTo?: Date;
    carerID?: TID;
  }): Promise<TRecordField[]>;
}
```

### 4. Use Cases

#### Single Unified Use Case
```typescript
// src/domain/summary/use-case/get-summary-by-period.use-case.ts

export class GetSummaryByPeriodUseCase {
  /**
   * Get module summary with period-based grouping
   */
  async getModuleSummary(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TModuleSummary> {
    // Use port to get grouped data
    return this.summaryGroupingPort.getModuleSummary(params);
  }

  /**
   * Get field summary with period-based grouping
   */
  async getFieldSummary(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TFieldSummary> {
    return this.summaryGroupingPort.getFieldSummary(params);
  }

  /**
   * Get multiple modules (for home screen)
   */
  async getModulesSummary(params: {
    moduleIds: TID[];
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TModuleSummary[]> {
    return this.summaryGroupingPort.getModulesSummary(params);
  }
}
```

---

## Adapter Implementation

### SQLite Adapter Strategy

The adapter implements the `ISummaryGroupingPort` with SQL grouping:

```typescript
// src/database/adapter/sqlite.summary-grouping.adapter.ts

export class SqliteSummaryGroupingAdapter implements ISummaryGroupingPort {

  async getModuleSummary(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TModuleSummary> {

    // 1. Calculate date range based on period
    const { startDate, endDate } = this.getDateRangeForPeriod(params.period);

    // 2. Build SQL query with period-specific grouping
    const groupByClause = this.buildGroupByClause(params.period);

    // 3. Execute query
    const query = `
      SELECT
        ${groupByClause} as bucket_label,
        COUNT(*) as count,
        ${this.getBucketTimestampExpression(params.period)} as bucket_timestamp
      FROM record_field rf
      INNER JOIN record r ON rf.recordID = r.id
      INNER JOIN module_field mf ON rf.fieldID = mf.id
      WHERE mf.moduleId = ?
        AND r.createdAt >= ?
        AND r.createdAt <= ?
        ${params.carerID ? 'AND r.carerID = ?' : ''}
      GROUP BY ${groupByClause}
      ORDER BY bucket_timestamp ASC
    `;

    // 4. Transform results into TModuleSummary
    // 5. Calculate statistics
    // 6. Return typed result
  }

  private buildGroupByClause(period: SUMMARY_PERIOD_ENUM): string {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return "strftime('%H', r.createdAt)"; // Hour (0-23)

      case SUMMARY_PERIOD_ENUM.WEEK:
        return "strftime('%w', r.createdAt)"; // Day of week (0-6)

      case SUMMARY_PERIOD_ENUM.MONTH:
        return "DATE(r.createdAt)"; // Full date

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        return "strftime('%Y-%W', r.createdAt)"; // Year-Week

      case SUMMARY_PERIOD_ENUM.YEAR:
        return "strftime('%Y-%m', r.createdAt)"; // Year-Month
    }
  }

  private getDateRangeForPeriod(period: SUMMARY_PERIOD_ENUM): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = now;
    let startDate: Date;

    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;

      case SUMMARY_PERIOD_ENUM.WEEK:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.MONTH:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        startDate = new Date(now.getTime() - 24 * 7 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return { startDate, endDate };
  }

  private fillMissingBuckets(
    buckets: TTimeBucket[],
    period: SUMMARY_PERIOD_ENUM,
    startDate: Date,
    endDate: Date
  ): TTimeBucket[] {
    // Generate all expected buckets for the period
    // Fill in missing buckets with value: 0
    // Ensure consistent bucket count per period type
  }
}
```

---

## UI Layer

### 1. Autonomous Hooks

Each screen creates its own hook that consumes the use-case directly:

```typescript
// src/domain/summary/hook/use-module-summary.hook.ts

export const useModuleSummary = (params: {
  moduleId: TID;
  period: SUMMARY_PERIOD_ENUM;
  loggerAdapter: ILoggerAdapter;
  summaryGroupingPort: ISummaryGroupingPort;
  notifyAdapter: INotifyAdapter;
}) => {
  const [data, setData] = useState<TModuleSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const useCase = new GetSummaryByPeriodUseCase(params.summaryGroupingPort);
      const result = await useCase.getModuleSummary({
        moduleId: params.moduleId,
        period: params.period,
      });
      setData(result);
    } catch (err) {
      setError(err);
      params.notifyAdapter.error('Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, [params.moduleId, params.period]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};
```

### 2. Simplified Screens

```typescript
// src/app/(tabs)/summary/detail/module/[moduleId].tsx

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams();
  const [period, setPeriod] = useState(SUMMARY_PERIOD_ENUM.WEEK);

  const { summaryGroupingPort, loggerAdapter, notifyAdapter } = useAdapters();

  // Direct consumption of use-case via hook
  const { data, loading, error, refetch } = useModuleSummary({
    moduleId: Number(moduleId),
    period,
    loggerAdapter,
    summaryGroupingPort,
    notifyAdapter,
  });

  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error} />;
  if (!data) return null;

  return (
    <ScreenLayout>
      {/* Period selector */}
      <PeriodSelector value={period} onChange={setPeriod} />

      {/* Chart - consumes typed period result directly */}
      <SummaryChart
        period={data.groupedData.period}
        buckets={data.groupedData.buckets}
      />

      {/* Statistics */}
      <StatisticsCard stats={data.statistics} />
    </ScreenLayout>
  );
}
```

### 3. Type-Safe Chart Component

```typescript
// src/ui/components/organisms/summary-chart.organism.tsx

type SummaryChartProps = {
  period: SUMMARY_PERIOD_ENUM;
  buckets: TTimeBucket[];
};

export const SummaryChart: FC<SummaryChartProps> = ({ period, buckets }) => {
  // Chart knows how to render based on period type
  const chartConfig = useMemo(() => {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return {
          xAxisLabel: 'Hour',
          xAxisFormatter: (bucket: TTimeBucket) => bucket.label, // "08:00"
          expectedBuckets: 24,
        };

      case SUMMARY_PERIOD_ENUM.WEEK:
        return {
          xAxisLabel: 'Day',
          xAxisFormatter: (bucket: TTimeBucket) => bucket.label, // "Mon"
          expectedBuckets: 7,
        };

      // ... other periods
    }
  }, [period]);

  return (
    <BarChart
      data={buckets.map(b => ({ label: b.label, value: b.value }))}
      config={chartConfig}
    />
  );
};
```

---

## Migration Strategy

### Phase 1: Create New Domain Layer (Parallel Development)
1. ✅ Create new DTOs in `src/domain/summary/dto/`
   - `grouped-record-fields.dto.ts`
   - `summary-period-results.dto.ts`
   - `module-summary.dto.ts`
   - `field-summary.dto.ts`

2. ✅ Create new port `src/domain/summary/port/summary-grouping.port.ts`

3. ✅ Create new use-case `src/domain/summary/use-case/get-summary-by-period.use-case.ts`

4. ✅ Implement SQLite adapter `src/database/adapter/sqlite.summary-grouping.adapter.ts`

5. ✅ Create new hooks:
   - `use-module-summary.hook.ts`
   - `use-field-summary.hook.ts`
   - `use-modules-summary.hook.ts` (for home)

### Phase 2: Migrate Screens One by One
1. ✅ Migrate `summary/detail/module/[moduleId].tsx`
   - Remove old hooks/adapters dependencies
   - Use new `useModuleSummary` hook
   - Simplify component logic

2. ✅ Migrate `summary/detail/module/[moduleId]/field/[fieldId].tsx`
   - Use new `useFieldSummary` hook

3. ✅ Migrate `summary/index.tsx` (home screen)
   - Use new `useModulesSummary` hook

4. ✅ Migrate other summary screens (trends, highlights)

### Phase 3: Remove Old Code
1. ✅ Delete deprecated summary use-cases:
   - `get-summary-detail.use-case.ts`
   - `get-summary-highlights.use-case.ts`
   - `get-summary-trends.use-case.ts`
   - `get-summary-modules.use-case.ts`

2. ✅ Delete deprecated ports:
   - `summary-detail.port.ts`
   - `summary-module.port.ts`
   - etc.

3. ✅ Delete deprecated adapters

4. ✅ Delete deprecated hooks

### Phase 4: Cleanup
1. ✅ Remove unused types/interfaces
2. ✅ Update documentation
3. ✅ Run tests

---

## Benefits of This Approach

### 1. **Simplicity**
- Single source of truth: `RecordField`
- One use-case to rule them all
- Type-safe period-based results
- No prop drilling

### 2. **Autonomy**
- Screens directly consume use-cases via hooks
- Components are self-contained
- Easy to test in isolation

### 3. **Flexibility**
- Easy to add new grouping dimensions
- Period changes handled automatically
- Filters (carerID, date ranges) are clean

### 4. **Type Safety**
- `SUMMARY_PERIOD_ENUM` drives return types
- TypeScript ensures correct bucket structures
- No runtime type errors

### 5. **Maintainability**
- Clear separation of concerns
- Single place to update grouping logic (adapter)
- Easier onboarding for new developers

### 6. **Performance**
- SQL-level grouping (efficient)
- Minimal data transformation
- Caching opportunities at adapter level

---

## Examples

### Example 1: Home Screen "Last 7 Days"

```typescript
const { data } = useModulesSummary({
  moduleIds: [1, 2, 3],  // URINE, STOOL, MEDICATION
  period: SUMMARY_PERIOD_ENUM.WEEK,
});

// data: TModuleSummary[]
data.forEach(moduleSummary => {
  // moduleSummary.groupedData.buckets has 7 elements (Mon-Sun)
  // moduleSummary.statistics.currentPeriodTotal
});
```

### Example 2: Module Detail "Last 24 Hours"

```typescript
const { data } = useModuleSummary({
  moduleId: 1,
  period: SUMMARY_PERIOD_ENUM.DAY,
});

// data.groupedData.buckets has 24 elements (0-23h)
// Chart renders with hourly X-axis
```

### Example 3: Field Trend "Last Year"

```typescript
const { data } = useFieldSummary({
  fieldId: 5,  // "volume" field
  period: SUMMARY_PERIOD_ENUM.YEAR,
});

// data.groupedData.buckets has 12 elements (Jan-Dec)
// data.distribution shows value distribution
// data.statistics.averageValue
```

---

## Open Questions

1. **Caching Strategy**: Should we cache results at the adapter level or use React Query?
2. **Real-time Updates**: How do we handle new records being created while viewing a summary?
3. **Filtering UI**: Do we need advanced filters (multiple carers, custom date ranges) in v1?
4. **Empty States**: How do we handle periods with zero data?
5. **Comparison Mode**: Do we need to compare two periods side-by-side?

---

## Future Enhancements

1. **Multi-dimensional Grouping**: Group by module AND carer simultaneously
2. **Custom Periods**: User-defined date ranges
3. **Export Data**: CSV/PDF export of summaries
4. **Anomaly Detection**: Highlight unusual patterns
5. **Predictive Analytics**: Forecast trends based on historical data
