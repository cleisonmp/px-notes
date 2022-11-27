import { forwardRef } from 'react'
import { cx } from 'classix'
import type {
  TextAreaComponentProps,
  TextAreaFieldProps,
  TextAreaLabelProps,
} from './textArea'
import { mockTextAreaComponentProps } from './textArea.mocks'

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaComponentProps>(
  function TextAreaComponent(
    {
      id,
      name,
      label,
      hasBorder = true,
      rounded = true,
      disabled = false,
      helperText,
      textAreaProps,
      labelProps,
      errorLabelProps,
      rows,
      ...props //form controller props onCHange/onBlur
    },
    ref,
  ) {
    //Props
    const textAreaClasses: TextAreaFieldProps = {
      border: hasBorder ? 'border' : 'border-none',
      rounded: rounded ? 'rounded' : '',

      ...mockTextAreaComponentProps.base.textAreaProps, //default props
      ...textAreaProps, //overrides default values with props
    }

    const labelClasses: TextAreaLabelProps = {
      ...mockTextAreaComponentProps.base.labelProps, //default props
      ...labelProps, //overrides default values with props
    }

    const errorLabelClasses = {
      textColor: disabled
        ? errorLabelProps?.disabledTextColor ??
          mockTextAreaComponentProps.base.errorLabelProps?.disabledTextColor
        : errorLabelProps?.textColor ??
          mockTextAreaComponentProps.base.errorLabelProps?.textColor,
    }

    return (
      <>
        <div className='flex w-full flex-col justify-center '>
          <div className='relative flex h-fit items-center text-center'>
            <textarea
              id={id ?? name}
              name={name}
              rows={rows}
              ref={ref}
              {...props}
              disabled={disabled}
              placeholder={'\u00A0'}
              className={cx(
                'resize-none py-2 px-4',
                'peer w-full placeholder-transparent outline-none transition-all focus:outline-none',
                'disabled:cursor-not-allowed', //fixed values
                ...Object.values(textAreaClasses), //array of props
              )}
            />
            <label
              htmlFor={id ?? name}
              className={cx(
                'absolute left-2 top-0 z-[1] -translate-y-1/2 px-2 transition-all',
                'peer-placeholder-shown:top-5 peer-placeholder-shown:-translate-y-1/2',
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
