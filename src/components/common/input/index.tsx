import { forwardRef, useCallback, useState } from 'react'
import { cx } from 'classix'
import type { InputComponentProps, InputFieldProps, LabelProps } from './input'
import { mockInputComponentProps } from './input.mocks'

export const Input = forwardRef<HTMLInputElement, InputComponentProps>(
  function InputComponent(
    {
      id,
      name,
      label,
      type = 'text',
      hasBorder = true,
      rounded = true,
      disabled = false,
      helperText,
      inputProps,
      labelProps,
      errorLabelProps,
      iconProps,
      ...props //form controller props onCHange/onBlur
    },
    ref,
  ) {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [inputType, setInputType] = useState(type)

    //Props
    const hasPasswordToggle = iconProps?.hasPasswordToggle
    const hasLeftIcon = !!iconProps?.leftIcon
    const hasRightIcon = !!iconProps?.rightIcon
    const hasBothIcons = hasLeftIcon && hasRightIcon

    const inputClasses: InputFieldProps = {
      positioning: cx(
        !hasLeftIcon && !hasRightIcon && 'py-2 px-4', //no icon
        hasBothIcons && 'py-2 px-4 pl-12 pr-12', //both icons
        !hasBothIcons && hasLeftIcon && 'py-2 px-4 pl-12', //only left icon
        !hasBothIcons && hasRightIcon && 'py-2 px-4 pr-12', //only right icon
      ),
      border: hasBorder ? 'border' : 'border-none',
      rounded: rounded ? 'rounded' : '',

      ...mockInputComponentProps.base.inputProps, //default props
      ...inputProps, //overrides default values with props
    }

    const labelClasses: LabelProps = {
      ...mockInputComponentProps.base.labelProps, //default props
      ...labelProps, //overrides default values with props
    }

    const errorLabelClasses = {
      textColor: disabled
        ? errorLabelProps?.disabledTextColor ??
          mockInputComponentProps.base.errorLabelProps?.disabledTextColor
        : errorLabelProps?.textColor ??
          mockInputComponentProps.base.errorLabelProps?.textColor,
    }

    const leftIconClasses = {
      iconColor: iconProps?.leftIconColor ?? inputClasses.textColor,
      disabledIconColor:
        iconProps?.disabledIconColor ??
        `peer-${inputClasses.disabledTextColor}`,
    }
    const rightIconClasses = {
      iconColor: iconProps?.rightIconColor ?? inputClasses.textColor,
      disabledIconColor:
        iconProps?.disabledIconColor ??
        `peer-${inputClasses.disabledTextColor}`,
    }

    const handleRightIconClick = useCallback(() => {
      if (hasPasswordToggle) {
        setInputType(passwordVisible ? 'text' : 'password')
        setPasswordVisible((state) => !state)
      } else {
        iconProps?.iconOnClickCallback?.()
      }
    }, [hasPasswordToggle, iconProps, passwordVisible])

    return (
      <>
        <div className='flex w-full flex-col justify-center '>
          <div className='relative flex h-fit items-center text-center'>
            <input
              id={id ?? name}
              name={name}
              type={inputType}
              ref={ref}
              {...props}
              disabled={disabled}
              placeholder={'\u00A0'}
              className={cx(
                'peer w-full placeholder-transparent outline-none transition-all focus:outline-none',
                'disabled:cursor-not-allowed', //fixed values
                ...Object.values(inputClasses), //array of props
              )}
            />
            <label
              htmlFor={id ?? name}
              className={cx(
                'absolute left-2 top-0 z-[1] -translate-y-1/2 px-2 transition-all',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2',
                hasLeftIcon && 'peer-placeholder-shown:left-10',
                'peer-focus:top-0 peer-focus:left-2',
                'peer-autofill:top-0 peer-autofill:left-2',
                'text-lg',
                'peer-disabled:cursor-not-allowed peer-disabled:bg-transparent',
                ...Object.values(labelClasses), //array of props
                'inline-flex select-none items-center gap-1 leading-none',
              )}
            >
              <span className="select-none pt-1 font-['Ruslan_Display'] text-lg leading-none ">
                {'<'}
              </span>
              {label}
              <span className="select-none pt-1 font-['Ruslan_Display'] text-lg leading-none ">
                {'>'}
              </span>
            </label>
            {hasLeftIcon && (
              <div
                className={cx(
                  'absolute left-4 peer-disabled:cursor-not-allowed ',
                  ...Object.values(leftIconClasses),
                )}
              >
                {iconProps?.leftIcon}
              </div>
            )}
            {hasRightIcon && (
              <div
                className={cx(
                  'absolute right-4 peer-disabled:cursor-not-allowed ',
                  (hasPasswordToggle || !!iconProps?.iconOnClickCallback) &&
                    'cursor-pointer',
                  ...Object.values(rightIconClasses),
                )}
                onClick={handleRightIconClick}
              >
                {hasPasswordToggle
                  ? passwordVisible
                    ? iconProps?.rightIcon
                    : iconProps?.rightIconHidePass
                  : iconProps?.rightIcon}
              </div>
            )}
          </div>
          <div
            className={cx(
              'relative flex w-full px-4 py-1 transition-all',
              'text-xs',
              !helperText?.length && 'hidden',
              ...Object.values(errorLabelClasses),
            )}
          >
            <span>{helperText}</span>
          </div>
        </div>
      </>
    )
  },
)
