import {render, screen} from '@testing-library/react';
import {Tabs} from './Tabs';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

const items = [
  {key: 'a', label: 'Alpha'},
  {key: 'b', label: 'Beta'},
];

describe('Tabs (web)', () => {
  it('renders', () => {
    render(<Tabs testID="tabs" items={items} value="a" onChange={() => {}} />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<Tabs testID="tabs" items={items} value="a" onChange={() => {}} />);
    const activeTab = screen.getByRole('tab', {name: 'Alpha'});
    expect(activeTab).toHaveStyle({color: colors.textBrand});
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Tabs testID="tabs" items={items} value="a" onChange={() => {}} />
      </ThemeProvider>,
    );
    const activeTab = screen.getByRole('tab', {name: 'Alpha'});
    expect(activeTab).toHaveStyle({color: darkColors.textBrand});
  });
});
