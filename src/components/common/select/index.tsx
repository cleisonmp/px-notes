import { useId } from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { Controller, useFormContext } from 'react-hook-form'
import ReactSelect from 'react-select/creatable'
import { components } from 'react-select'
import type { MultiValueGenericProps } from 'react-select'

//in order to allow tailwind classes to have higher priority over react-select defaults
const cache = createCache({
  key: 'react-select-custom-cache',
  prepend: true,
})

export interface SelectOptions {
  id?: string | number
  value: string | number
  label: string
  isDisabled?: boolean
}

interface SelectProps {
  options: SelectOptions[]
  isLoading?: boolean
  //register: UseFormRegister
  /*onChange?: string
  value?: string
  ref?: string*/
}

const MultiValueLabel = ({ children, ...props }: MultiValueGenericProps) => {
  return (
    <components.MultiValueLabel {...props}>
      <span
        onDoubleClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('call edit tag modal')
        }}
      >
        {children}
      </span>
    </components.MultiValueLabel>
  )
}

export const Select = ({ options, isLoading }: SelectProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  const instaceId = useId()

  return (
    <CacheProvider value={cache}>
      <Controller
        name='tags'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            instanceId={instaceId}
            isMulti
            isLoading={isLoading}
            options={options}
            components={{ MultiValueLabel }}
            placeholder='Select or create a category...'
            classNames={{ control: () => 'p-2' }}
          />
        )}
      />
      {errors.tags && <p className='errorMsg'>This is a required field.</p>}
    </CacheProvider>
  )
}
