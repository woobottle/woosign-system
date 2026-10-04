import {useId, useState} from 'react';
import * as W from 'woosign-system';

export const groups = {
  '기본 요소': [
    'Button',
    'Text',
    'Badge',
    'Chip',
    'Pill',
    'Eyebrow',
    'StatusDot',
    'Divider',
    'Fab',
  ],
  레이아웃: [
    'Box',
    'Card',
    'FeatureBand',
    'AspectRatio',
    'ScrollArea',
    'ListItem',
  ],
  '폼과 입력': [
    'Input',
    'Textarea',
    'Select',
    'Checkbox',
    'Radio',
    'Switch',
    'Label',
    'FormField',
    'Slider',
    'InputOTP',
    'Combobox',
    'Calendar',
    'DatePicker',
  ],
  탐색: [
    'Tabs',
    'Breadcrumb',
    'Pagination',
    'SegmentedControl',
    'Toggle',
    'ToggleGroup',
  ],
  피드백: [
    'Avatar',
    'AvatarGroup',
    'Skeleton',
    'Spinner',
    'Progress',
    'Alert',
    'EmptyState',
    'Toast',
  ],
  오버레이: [
    'Dialog',
    'BottomSheet',
    'Drawer',
    'Tooltip',
    'Popover',
    'DropdownMenu',
    'Accordion',
    'Collapsible',
  ],
} as const;
export const names = Object.values(groups).flat();
export type ComponentName = (typeof names)[number];
export const descriptions: Record<ComponentName, string> = {
  Button: '명확한 다음 행동을 만드는 버튼',
  Text: '읽기 편한 텍스트와 타이포그래피',
  Badge: '작지만 명확한 상태 표시',
  Chip: '가볍게 선택하는 필터',
  Pill: '둥근 형태의 선택 요소',
  Eyebrow: '제목 위에 놓는 작은 맥락',
  StatusDot: '색상으로 전하는 상태',
  Divider: '내용을 구분하는 선',
  Fab: '항상 가까이 있는 주요 행동',
  Box: '일관된 간격을 만드는 레이아웃',
  Card: '정보와 행동을 담는 카드',
  FeatureBand: '강조할 이야기를 위한 영역',
  AspectRatio: '일정한 비율을 유지하는 콘텐츠',
  ScrollArea: '긴 콘텐츠를 위한 스크롤 영역',
  ListItem: '반복되는 정보를 정리하는 행',
  Input: '한 줄 텍스트 입력',
  Textarea: '여러 줄의 생각을 담는 입력',
  Select: '목록에서 하나를 선택',
  Checkbox: '여러 항목을 자유롭게 선택',
  Radio: '선택지 중 하나를 결정',
  Switch: '설정을 켜고 끄는 스위치',
  Label: '입력의 목적을 설명하는 레이블',
  FormField: '설명과 오류를 함께 보여주는 필드',
  Slider: '범위 안에서 값을 조절',
  InputOTP: '인증 번호를 나누어 입력',
  Combobox: '검색으로 빠르게 찾는 선택지',
  Calendar: '날짜를 한눈에 확인하고 선택',
  DatePicker: '필요할 때 열어 쓰는 날짜 선택',
  Tabs: '관련 콘텐츠 사이를 이동',
  Breadcrumb: '현재 위치와 상위 경로',
  Pagination: '페이지 단위로 콘텐츠 탐색',
  SegmentedControl: '짧은 선택지를 나란히 배치',
  Toggle: '하나의 상태를 전환',
  ToggleGroup: '여러 상태를 묶어서 선택',
  Avatar: '사람을 표현하는 프로필',
  AvatarGroup: '함께하는 사람들의 모음',
  Skeleton: '콘텐츠를 기다리는 자리',
  Spinner: '진행 중인 작업 표시',
  Progress: '완료까지의 진행 상황',
  Alert: '놓치면 안 되는 안내',
  EmptyState: '첫 행동을 돕는 빈 화면',
  Toast: '작업 결과를 짧게 전달',
  Dialog: '집중이 필요한 확인과 선택',
  BottomSheet: '아래에서 올라오는 보조 화면',
  Drawer: '옆에서 펼치는 추가 정보',
  Tooltip: '요소에 대한 짧은 설명',
  Popover: '맥락 안에서 보여주는 추가 정보',
  DropdownMenu: '필요한 행동을 모아 놓은 메뉴',
  Accordion: '정보를 필요한 만큼 펼치기',
  Collapsible: '한 영역을 접고 펼치기',
};
const options = [
  {value: 'paper', label: 'Paper'},
  {value: 'ink', label: 'Ink'},
  {value: 'ember', label: 'Ember'},
];
export function Demo({
  name,
  disabled = false,
  variant = 'default',
}: {
  name: ComponentName;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}) {
  const id = useId();
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('paper');
  const [input, setInput] = useState('');
  const [number, setNumber] = useState(name === 'Pagination' ? 1 : 40);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>('');
  const [many, setMany] = useState<readonly string[]>([]);
  const toast = W.useToast();
  switch (name) {
    case 'Button':
      return (
        <W.Button
          variant={variant}
          disabled={disabled}
          onPress={() =>
            toast.success({
              title: '잘했어요! 다음 단계로 이동할 준비가 됐어요.',
            })
          }>
          시작하기 ↗
        </W.Button>
      );
    case 'Text':
      return (
        <div>
          <W.Text variant="h2">Make room for good things.</W.Text>
          <W.Text variant="muted">작은 디테일이 좋은 경험을 만듭니다.</W.Text>
        </div>
      );
    case 'Badge':
      return (
        <div className="demo-row">
          <W.Badge>New</W.Badge>
          <W.Badge variant="gold">Member</W.Badge>
          <W.Badge variant="outline">v0.6.0</W.Badge>
        </div>
      );
    case 'Chip':
      return (
        <W.Chip
          disabled={disabled}
          onPress={() => setChecked(!checked)}
          tone={checked ? 'solid' : 'outline'}>
          {checked ? '선택됨 ✓' : '디자인'}
        </W.Chip>
      );
    case 'Pill':
      return (
        <W.Pill
          active={checked}
          disabled={disabled}
          onPress={() => setChecked(!checked)}>
          이번 주
        </W.Pill>
      );
    case 'Eyebrow':
      return <W.Eyebrow tone="brand">A LITTLE EVERY DAY</W.Eyebrow>;
    case 'StatusDot':
      return (
        <div className="demo-row">
          <W.StatusDot tone="success" /> 모든 시스템 정상
        </div>
      );
    case 'Divider':
      return (
        <div className="demo-stack">
          위의 이야기
          <W.Divider />
          아래의 이야기
        </div>
      );
    case 'Fab':
      return (
        <W.Fab
          accessibilityLabel="새 항목 추가"
          disabled={disabled}
          onPress={() => toast.success({title: '새 항목을 추가했어요.'})}>
          ＋
        </W.Fab>
      );
    case 'Box':
      return (
        <W.Box padding={24} gap={12}>
          <W.Badge>16px gap</W.Badge>
          <W.Text>여백에도 규칙이 있습니다.</W.Text>
        </W.Box>
      );
    case 'Card':
      return (
        <W.Card variant="warm">
          <W.CardHeader>
            <W.CardTitle>오늘의 작은 목표</W.CardTitle>
            <W.CardDescription>꾸준함을 위한 한 걸음</W.CardDescription>
          </W.CardHeader>
          <W.CardContent>
            <W.Progress value={number} />
          </W.CardContent>
          <W.CardFooter>
            <W.Button onPress={() => setNumber(Math.min(100, number + 20))}>
              한 걸음 더
            </W.Button>
          </W.CardFooter>
        </W.Card>
      );
    case 'FeatureBand':
      return (
        <W.FeatureBand tone="forest">
          <W.Text color="#FFFFFF" variant="h3">
            Good things take time.
          </W.Text>
          <W.Text color="#FFFFFF">당신의 속도로 만들어 가세요.</W.Text>
        </W.FeatureBand>
      );
    case 'AspectRatio':
      return (
        <W.AspectRatio ratio={16 / 9}>
          <div className="ratio-art">
            16 / 9<span>Paper & Ink</span>
          </div>
        </W.AspectRatio>
      );
    case 'ScrollArea':
      return (
        <W.ScrollArea maxHeight={150} label="읽기 목록">
          <div className="demo-stack">
            {Array.from({length: 8}, (_, i) => (
              <W.ListItem
                key={i}
                title={`좋은 아이디어 ${i + 1}`}
                description="조금씩 모아가는 영감"
              />
            ))}
          </div>
        </W.ScrollArea>
      );
    case 'ListItem':
      return (
        <W.ListItem
          leading={<W.Avatar name="Woo" />}
          title="WooBottle"
          description="좋은 경험을 함께 만듭니다"
          trailing="↗"
          onPress={() => toast.success({title: '프로필을 선택했어요.'})}
        />
      );
    case 'Input':
      return (
        <W.Input
          value={input}
          onChangeText={setInput}
          placeholder="당신의 이름"
          disabled={disabled}
          inputProps={{'aria-label': '이름'}}
        />
      );
    case 'Textarea':
      return (
        <W.Textarea
          value={input}
          onChangeText={setInput}
          placeholder="오늘의 생각을 적어보세요."
          disabled={disabled}
          inputProps={{'aria-label': '오늘의 생각'}}
        />
      );
    case 'Select':
      return (
        <W.Select
          options={options}
          value={value}
          onValueChange={setValue}
          label="팔레트"
          disabled={disabled}
        />
      );
    case 'Checkbox':
      return (
        <W.Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          label="오늘의 목표를 완료했어요"
          disabled={disabled}
        />
      );
    case 'Radio':
      return (
        <W.RadioGroup
          value={value}
          onValueChange={setValue}
          disabled={disabled}>
          <W.Radio value="paper" label="Paper" />
          <W.Radio value="ink" label="Ink" />
        </W.RadioGroup>
      );
    case 'Switch':
      return (
        <W.Switch
          checked={checked}
          onCheckedChange={setChecked}
          label="알림 받기"
          disabled={disabled}
        />
      );
    case 'Label':
      return (
        <div className="demo-stack">
          <W.Label htmlFor={id} required>
            이메일
          </W.Label>
          <W.Input id={id} placeholder="hello@example.com" />
        </div>
      );
    case 'FormField':
      return (
        <W.FormField
          id={id}
          label="이메일"
          description="업데이트를 보내드릴게요."
          required>
          {props => (
            <W.Input
              id={props.id}
              required={props.required}
              placeholder="hello@example.com"
              inputProps={{'aria-describedby': props['aria-describedby']}}
            />
          )}
        </W.FormField>
      );
    case 'Slider':
      return (
        <div className="demo-stack">
          <W.Slider
            label="볼륨"
            value={number}
            onValueChange={setNumber}
            disabled={disabled}
          />
          <span>볼륨 {number}%</span>
        </div>
      );
    case 'InputOTP':
      return (
        <W.InputOTP
          value={input}
          onChangeText={setInput}
          length={4}
          label="인증 코드"
          disabled={disabled}
        />
      );
    case 'Combobox':
      return (
        <W.Combobox
          id={id}
          label="팔레트 검색"
          options={options}
          value={value}
          onValueChange={setValue}
          disabled={disabled}
        />
      );
    case 'Calendar':
      return (
        <W.Calendar
          value={date}
          onValueChange={setDate}
          locale="ko"
          disabled={disabled}
        />
      );
    case 'DatePicker':
      return (
        <W.DatePicker
          label="시작 날짜"
          value={date}
          onValueChange={setDate}
          locale="ko"
          disabled={disabled}
        />
      );
    case 'Tabs':
      return (
        <div className="demo-stack">
          <W.Tabs
            items={options.map(o => ({key: o.value, label: o.label}))}
            value={value}
            onChange={setValue}
          />
          <W.Text>{value}의 이야기</W.Text>
        </div>
      );
    case 'Breadcrumb':
      return (
        <W.Breadcrumb
          items={[
            {label: '홈', href: '/woosign/'},
            {label: '컴포넌트', href: '/woosign/components/'},
            {label: 'Breadcrumb'},
          ]}
        />
      );
    case 'Pagination':
      return (
        <W.Pagination
          totalPages={5}
          page={Math.min(number, 5)}
          onPageChange={setNumber}
          disabled={disabled}
        />
      );
    case 'SegmentedControl':
      return (
        <W.SegmentedControl
          label="팔레트 선택"
          items={options}
          value={value}
          onValueChange={setValue}
          disabled={disabled}
        />
      );
    case 'Toggle':
      return (
        <W.Toggle
          label="즐겨찾기"
          pressed={checked}
          onPressedChange={setChecked}
          disabled={disabled}>
          ★
        </W.Toggle>
      );
    case 'ToggleGroup':
      return (
        <W.ToggleGroup
          label="텍스트 스타일"
          items={[
            {value: 'bold', label: '굵게'},
            {value: 'italic', label: '기울임'},
          ]}
          value={many}
          onValueChange={setMany}
          multiple
          disabled={disabled}
        />
      );
    case 'Avatar':
      return (
        <div className="demo-row">
          <W.Avatar name="Woo Bottle" />
          <W.Avatar name="Paper Ink" size={56} />
        </div>
      );
    case 'AvatarGroup':
      return (
        <W.AvatarGroup
          items={['Woo', 'Paper', 'Ink', 'Ember', 'Forest'].map(name => ({
            name,
          }))}
          max={3}
        />
      );
    case 'Skeleton':
      return (
        <div className="demo-stack">
          <W.Skeleton width={48} height={48} circle />
          <W.Skeleton width={200} height={16} />
          <W.Skeleton width={140} height={16} />
        </div>
      );
    case 'Spinner':
      return <W.Spinner label="불러오는 중" />;
    case 'Progress':
      return (
        <div className="demo-stack">
          <W.Progress value={number} />
          <W.Button
            variant="outline"
            size="sm"
            onPress={() => setNumber((number + 20) % 120)}>
            진행률 {number}% · 변경
          </W.Button>
        </div>
      );
    case 'Alert':
      return (
        <W.Alert title="모두 준비됐어요" tone="success">
          이제 새로운 이야기를 시작하세요.
        </W.Alert>
      );
    case 'EmptyState':
      return (
        <W.EmptyState
          title="아직 기록이 없어요"
          description="오늘의 첫 번째 기록을 남겨보세요."
          icon="✦"
          action={
            <W.Button
              onPress={() => toast.success({title: '첫 기록을 시작해요.'})}>
              기록 시작
            </W.Button>
          }
        />
      );
    case 'Toast':
      return (
        <div className="demo-stack">
          <W.Toast
            title="저장했어요"
            description="변경 내용이 반영됐습니다."
            tone="success"
          />
          <W.Button
            variant="outline"
            onPress={() => toast.success({title: '저장했어요'})}>
            알림 띄우기
          </W.Button>
        </div>
      );
    case 'Dialog':
      return (
        <>
          <W.Button onPress={() => setOpen(true)}>다이얼로그 열기</W.Button>
          <W.Dialog open={open} onClose={() => setOpen(false)}>
            <W.Dialog.Header>
              <W.Dialog.Title>새롭게 시작할까요?</W.Dialog.Title>
              <W.Dialog.Description>
                당신의 다음 이야기를 기다립니다.
              </W.Dialog.Description>
            </W.Dialog.Header>
            <W.Dialog.Body>
              계속 진행하면 새로운 기록을 시작합니다.
            </W.Dialog.Body>
            <W.Dialog.Footer>
              <W.Button onPress={() => setOpen(false)}>확인</W.Button>
            </W.Dialog.Footer>
          </W.Dialog>
        </>
      );
    case 'BottomSheet':
      return (
        <>
          <W.Button onPress={() => setOpen(true)}>시트 열기</W.Button>
          <W.BottomSheet open={open} onClose={() => setOpen(false)}>
            <W.BottomSheet.Header>
              <W.BottomSheet.Title>가까이 있는 선택</W.BottomSheet.Title>
            </W.BottomSheet.Header>
            <W.BottomSheet.Body>편안하게 내용을 확인하세요.</W.BottomSheet.Body>
            <W.BottomSheet.Footer>
              <W.Button onPress={() => setOpen(false)}>완료</W.Button>
            </W.BottomSheet.Footer>
          </W.BottomSheet>
        </>
      );
    case 'Drawer':
      return (
        <>
          <W.Button onPress={() => setOpen(true)}>드로어 열기</W.Button>
          <W.Drawer open={open} onClose={() => setOpen(false)}>
            <W.Drawer.Header>
              <W.Drawer.Title>당신의 공간</W.Drawer.Title>
            </W.Drawer.Header>
            <W.Drawer.Body>추가 정보와 설정을 한곳에.</W.Drawer.Body>
            <W.Drawer.Footer>
              <W.Button onPress={() => setOpen(false)}>닫기</W.Button>
            </W.Drawer.Footer>
          </W.Drawer>
        </>
      );
    case 'Tooltip':
      return (
        <W.Tooltip
          id={id}
          trigger="마우스를 올려보세요"
          content="키보드 포커스로도 볼 수 있어요."
        />
      );
    case 'Popover':
      return (
        <W.Popover label="추가 안내" trigger="더 알아보기">
          <W.Text>작은 디테일을 위한 추가 설명입니다.</W.Text>
        </W.Popover>
      );
    case 'DropdownMenu':
      return (
        <W.DropdownMenu
          label="기록 메뉴"
          trigger="기록 관리 ↓"
          items={[
            {
              value: 'edit',
              label: '편집',
              onSelect: () => toast.success({title: '편집을 선택했어요'}),
            },
            {
              value: 'copy',
              label: '복사',
              onSelect: () => toast.success({title: '복사를 선택했어요'}),
            },
          ]}
        />
      );
    case 'Accordion':
      return (
        <W.Accordion
          id={id}
          items={[
            {
              value: 'web',
              title: 'Web에서도 사용할 수 있나요?',
              content: 'React와 React Native에서 같은 API를 사용합니다.',
            },
            {
              value: 'theme',
              title: '다크 모드를 지원하나요?',
              content: 'ThemeProvider로 라이트와 다크 테마를 전환하세요.',
            },
          ]}
        />
      );
    case 'Collapsible':
      return (
        <W.Collapsible id={id} title="조금 더 알아보기">
          하나의 디자인 언어로 여러 화면을 연결합니다.
        </W.Collapsible>
      );
  }
}
