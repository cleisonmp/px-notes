import type { TextAreaComponentProps } from './textArea'

const base: TextAreaComponentProps = {
  id: 'textArea',
  name: 'textArea',
  label: 'Default Props',
  hasBorder: true,
  rounded: true,
  disabled: false,
  helperText: '',
  textAreaProps: {
    textSize: 'text-xl',
    textColor: 'text-app-text',
    borderColor: 'border-app-border',
    bgColor: 'bg-transparent',
    autofillBg: 'autofill:bg-transparent',
    shadow: 'shadow-sm',
    invalidBorderColor: 'invalid:border-app-error',
    invalidTextColor: 'invalid:text-app-error',
    focusBorderColor: 'focus:border-app-info',
    disabledBgColor: 'disabled:bg-app-backgroundDisabled',
    disabledTextColor: 'disabled:text-app-textDisabled',
    disabledBorderColor: 'disabled:border-app-borderDisabled',
    disabledShadow: 'disabled:shadow-none',
  },
  labelProps: {
    textColor: 'text-app-label',
    bgColor: 'bg-app-background',
    focusColor: 'peer-focus:text-app-info',
    invalidTextColor: 'peer-invalid:text-app-error',
    disabledTextColor: 'peer-disabled:text-app-textDisabled',
  },
  errorLabelProps: {
    textColor: 'text-app-error',
    disabledTextColor: 'text-app-textDisabled',
  },
}

export const mockTextAreaComponentProps = {
  base,
}
