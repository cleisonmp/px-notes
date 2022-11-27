export interface InputFieldProps {
  textSize?: string
  textColor?: string
  positioning: string
  borderColor?: string
  bgColor?: string
  autofillBg?: string
  shadow?: ShadowSizes
  border?: string
  rounded?: string
  invalidBorderColor?: string
  invalidTextColor?: string
  focusBorderColor?: string
  disabledBgColor?: string
  disabledTextColor?: string
  disabledBorderColor?: string
  disabledShadow?: DisabledShadowSizes
}

export interface LabelProps {
  textColor?: string
  bgColor?: string
  focusColor?: string
  invalidTextColor?: string
  disabledTextColor?: string
}

export interface ErrorLabelProps {
  textColor?: string
  disabledTextColor?: string
}

export type IconProps =
  | {
      hasPasswordToggle: true
      disabledIconColor?: string
      leftIcon?: ReactNode
      leftIconColor?: string
      rightIcon: ReactNode
      rightIconColor?: string
      rightIconHidePass: ReactNode
      iconOnClickCallback?: never
    }
  | {
      hasPasswordToggle?: false
      disabledIconColor?: string
      leftIcon?: ReactNode
      leftIconColor?: string
      rightIcon?: ReactNode
      rightIconColor?: string
      rightIconHidePass?: never
      iconOnClickCallback?: () => void
    }

export interface InputComponentProps {
  id?: string
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  hasBorder?: boolean
  rounded?: boolean
  disabled?: boolean
  helperText?: string
  inputProps?: Omit<InputFieldProps, 'positioning'> //this props is only used internally
  labelProps?: LabelProps
  errorLabelProps?: ErrorLabelProps
  iconProps?: IconProps
}
