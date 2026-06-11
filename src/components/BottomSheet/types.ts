import type {ReactNode} from 'react';
import type {ViewStyle} from 'react-native';

/** web/native 공통 컨테이너 props. */
export interface BottomSheetBaseProps {
  /** 표시 여부 (controlled). */
  open: boolean;
  /** scrim 클릭 / Esc / Android back / 드래그 디스미스 시 호출. */
  onClose: () => void;
  /** scrim 클릭으로 닫을지. 기본 true. */
  closeOnScrimClick?: boolean;
  /** Esc(web) / Android back(native)로 닫을지. 기본 true. */
  closeOnEsc?: boolean;
  /** 핸들 드래그로 닫을지. true면 grabber 핸들을 자동 렌더. 기본 true. */
  dragToClose?: boolean;
  /** 화면 높이 대비 시트 최대 높이 비율(0~1). 기본 0.9. */
  maxHeightRatio?: number;
  children?: ReactNode;
  testID?: string;
}

export interface BottomSheetWebProps extends BottomSheetBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface BottomSheetNativeProps extends BottomSheetBaseProps {
  style?: ViewStyle;
}

export type BottomSheetProps = BottomSheetBaseProps & {
  className?: string;
  style?: ViewStyle | React.CSSProperties;
};

/** 서브컴포넌트 공통 props. */
export interface BottomSheetSectionProps {
  children?: ReactNode;
  style?: ViewStyle | React.CSSProperties;
  className?: string;
}

export type BottomSheetHeaderProps = BottomSheetSectionProps;
export type BottomSheetTitleProps = BottomSheetSectionProps;
export type BottomSheetDescriptionProps = BottomSheetSectionProps;
export type BottomSheetBodyProps = BottomSheetSectionProps;
export type BottomSheetFooterProps = BottomSheetSectionProps;

/** aria id 전달용 context 값 (web 한정 의미). */
export interface BottomSheetContextValue {
  titleId: string;
  descriptionId: string;
  /** BottomSheetTitle이 마운트되면 true로 등록 (aria-labelledby 연결용). */
  registerTitle: (present: boolean) => void;
  /** BottomSheetDescription이 마운트되면 true로 등록 (aria-describedby 연결용). */
  registerDescription: (present: boolean) => void;
}
