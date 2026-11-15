import type {CSSProperties, ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

export interface CarouselBaseProps {
  /** Each child is one full-width slide. */
  children: ReactNode;
  /** Zero-based index of the visible slide. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Show previous/next buttons. */
  showControls?: boolean;
  /** Show one dot per slide. */
  showIndicators?: boolean;
  /** Accessible name for the carousel. */
  label: string;
  testID?: string;
}
export interface CarouselWebProps extends CarouselBaseProps {
  style?: CSSProperties;
  className?: string;
}
export interface CarouselNativeProps extends CarouselBaseProps {
  style?: ViewStyle;
}
export type CarouselProps = CarouselBaseProps & {
  style?: CSSProperties | ViewStyle;
  className?: string;
};
