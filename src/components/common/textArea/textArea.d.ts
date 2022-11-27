export interface TextAreaFieldProps {
  textSize?: string
  textColor?: string
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

export interface TextAreaLabelProps {
  textColor?: string
  bgColor?: string
  focusColor?: string
  invalidTextColor?: string
  disabledTextColor?: string
}

export interface TextAreaErrorLabelProps {
  textColor?: string
  disabledTextColor?: string
}

export interface TextAreaComponentProps {
  id?: string
  name: string
  rows?: number
  label: string
  hasBorder?: boolean
  rounded?: boolean
  disabled?: boolean
  helperText?: string
  textAreaProps?: TextAreaProps
  labelProps?: TextAreaLabelProps
  errorLabelProps?: TextAreaErrorLabelProps
}
