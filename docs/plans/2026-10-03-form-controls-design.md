# Form controls design

Approved scope: existing component quality improvements and Select / Textarea.

Textarea delegates to Input with multiline enabled, a default of three rows and top alignment. Input multiline height is derived from rows and size; explicit consumer styles remain authoritative.

Select shares options (label, value, disabled), controlled/uncontrolled value, onValueChange, placeholder, label, size, variant and disabled props. Web uses a native select with form attributes. Native uses a Pressable and the existing BottomSheet with scrollable accessible choices. Disabled options cannot be selected. Selecting closes the sheet; dismissing does not change the value.

Both controls consume existing theme tokens. Test interactions, disabled states, uncontrolled values and theme behavior on both platforms. Add Storybook examples and README usage. Fix existing formatting errors and settle Switch test animations with fake timers.
