import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

/** web/native 공통 컨테이너 props. */
export interface DrawerBaseProps {
  /** 표시 여부 (controlled). */
  open: boolean;
  /** scrim 클릭 / Esc / Android back 시 호출. */
  onClose: () => void;
  /** 패널 폭(px). 기본 320. 화면폭보다 크면 화면폭으로 클램프(native). */
  width?: number;
  /** scrim 클릭으로 닫을지. 기본 true. */
  closeOnScrimClick?: boolean;
  /** Esc(web) / Android back(native)로 닫을지. 기본 true. */
  closeOnEsc?: boolean;
  children?: ReactNode;
  testID?: string;
}

export interface DrawerWebProps extends DrawerBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface DrawerNativeProps extends DrawerBaseProps {
  style?: ViewStyle;
}

export type DrawerProps = DrawerBaseProps & {
  className?: string;
  style?: ViewStyle | React.CSSProperties;
};

/** 서브컴포넌트 공통 props. */
export interface DrawerSectionProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

export type DrawerHeaderProps = DrawerSectionProps;
export type DrawerTitleProps = DrawerSectionProps;
export type DrawerDescriptionProps = DrawerSectionProps;
export type DrawerBodyProps = DrawerSectionProps;
export type DrawerFooterProps = DrawerSectionProps;

/** aria id 전달용 context 값 (web 한정 의미). */
export interface DrawerContextValue {
  titleId: string;
  descriptionId: string;
  /** DrawerTitle이 마운트되면 true로 등록 (aria-labelledby 연결용). */
  registerTitle: (present: boolean) => void;
  /** DrawerDescription이 마운트되면 true로 등록 (aria-describedby 연결용). */
  registerDescription: (present: boolean) => void;
}
