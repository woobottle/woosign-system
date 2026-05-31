import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

/** Dialog 표면 폭 프리셋. */
export type DialogSize = 'sm' | 'md' | 'lg';

/** web/native 공통 컨테이너 props. */
export interface DialogBaseProps {
  /** 표시 여부 (controlled). */
  open: boolean;
  /** scrim 클릭 / Esc / Android back 시 호출. */
  onClose: () => void;
  /** 표면 폭 프리셋. 기본 'md'. */
  size?: DialogSize;
  /** scrim 클릭으로 닫을지. 기본 true. */
  closeOnScrimClick?: boolean;
  /** Esc(web) / Android back(native)로 닫을지. 기본 true. */
  closeOnEsc?: boolean;
  children?: ReactNode;
  testID?: string;
}

export interface DialogWebProps extends DialogBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface DialogNativeProps extends DialogBaseProps {
  style?: ViewStyle;
}

export type DialogProps = DialogBaseProps & {
  className?: string;
  style?: ViewStyle | React.CSSProperties;
};

/** 서브컴포넌트 공통 props. */
export interface DialogSectionProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

export type DialogHeaderProps = DialogSectionProps;
export type DialogTitleProps = DialogSectionProps;
export type DialogDescriptionProps = DialogSectionProps;
export type DialogBodyProps = DialogSectionProps;
export type DialogFooterProps = DialogSectionProps;

/** aria id 전달용 context 값 (web 한정 의미). */
export interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  /** DialogTitle가 마운트되면 true로 등록 (aria-labelledby 연결용). */
  registerTitle: (present: boolean) => void;
  /** DialogDescription가 마운트되면 true로 등록 (aria-describedby 연결용). */
  registerDescription: (present: boolean) => void;
}
