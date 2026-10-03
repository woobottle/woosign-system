# Component expansion design

Approved: Avatar, AvatarGroup, Skeleton, Spinner, Alert, EmptyState, Label,
FormField, Accordion, Collapsible, ListItem, AspectRatio, ScrollArea,
Breadcrumb, Pagination, SegmentedControl, Toggle, ToggleGroup, Slider,
InputOTP, Combobox, Calendar, DatePicker, Tooltip, Popover, DropdownMenu.

Every component has common props, platform implementations, exports, stories and
behavior tests. Existing tokens and controlled/uncontrolled state utilities are
shared; platform semantics stay in .web/.native files. Menus and searchable
selection reuse BottomSheet on native. Popover uses anchored content on web and
BottomSheet on native. DatePicker composes Calendar and Popover.

Web controls provide native keyboard behavior or composite keyboard navigation.
Native controls expose accessibility roles, state and adjustable actions. Calendar
uses strict local YYYY-MM-DD dates, bounds and disabled date predicates. Slider
uses DOM range / native responder and accessibility increment/decrement actions.
OTP uses one semantic input with visual slots, supports paste and completion.

No new runtime dependencies. No charts, advanced tables, upload infrastructure or
rich text editor in this approved scope. Existing uncommitted work is preserved.
