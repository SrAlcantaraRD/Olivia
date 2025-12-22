import { render } from '@testing-library/react-native';

import PieChartAtom from './pie-chart.atom';

describe('PieChartAtom', () => {
  it('renders without crashing with values', () => {
    const values = [
      { value: 'A', count: 10 },
      { value: 'B', count: 5 },
      { value: 'C', count: 2 },
    ];

    const { toJSON } = render(<PieChartAtom values={values} />);

    expect(toJSON()).toBeTruthy();
  });
});
