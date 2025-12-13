import { render } from '@testing-library/react-native';

jest.mock('react-native-gifted-charts', () => ({
  BarChart: () => null,
  PieChart: () => null,
  LineChart: () => null,
}));

import { BarChartAtom } from '@/ui/components/atoms/bar-chart.atom';

describe('BarChartAtom', () => {
  it('renders without crashing with values', () => {
    const values = [
      { value: 'A', count: 10 },
      { value: 'B', count: 5 },
      { value: 'C', count: 2 },
    ];

    const { toJSON } = render(
      <BarChartAtom values={values} testID="test.bar-chart" />
    );

    expect(toJSON()).toBeTruthy();
  });
});
