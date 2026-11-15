# Changelog

## Unreleased

- Add cross-platform Table: columns with custom cells, alignment and widths;
  client-side sorting (controlled/uncontrolled) with `aria-sort` on web and
  labelled sort buttons on native; empty state, striped rows, horizontal scroll
  on native.
- Add cross-platform Carousel: full-width slides with scroll-snap (web) or paging
  ScrollView (native), previous/next buttons, dot indicators, arrow keys on web,
  controlled/uncontrolled index. Off-screen slides are hidden from screen readers.
- Add cross-platform Stepper: horizontal/vertical layout, complete/current/upcoming
  status, optional step descriptions, and `navigable` back-navigation to completed
  steps. Web uses an ordered list with `aria-current="step"`; native announces
  each step's position and status.
- Move literal native component styles into `StyleSheet.create`; lint now runs
  with zero warnings.

## 0.6.0

- Add cross-platform Select and Textarea.
- Add Avatar, AvatarGroup, Skeleton, Spinner, Alert, EmptyState, Label and FormField.
- Add Accordion, Collapsible, ListItem, AspectRatio, ScrollArea, Breadcrumb and Pagination.
- Add SegmentedControl, Toggle, ToggleGroup, Slider and InputOTP.
- Add Combobox, Calendar, DatePicker, Tooltip, Popover and DropdownMenu.
- Support light/dark themes, controlled/uncontrolled input state, disabled choices,
  web keyboard navigation, popup focus restoration and native accessibility actions.
- Improve multiline Input sizing and date Input uncontrolled values, read-only
  behavior and Escape dismissal. Reuse the public themed Calendar for date Input.
- Improve native BottomSheet accessibility and screen reader escape dismissal.
- Add Web/Native Storybook examples, public API documentation and behavior tests.
- Resolve existing lint errors and Switch animation test warnings.

Validation: 108 test suites / 328 tests; typecheck, library build, Web Storybook
build, new Web/Native story typecheck and Native Storybook generation passed.
