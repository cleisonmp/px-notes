import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import ReactSelect from 'react-select/creatable'

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
}

export const Select = ({ options, isLoading }: SelectProps) => {
  return (
    <CacheProvider value={cache}>
      <ReactSelect
        isMulti
        isLoading={isLoading}
        options={options}
        placeholder='Select or create a category...'
        classNames={{ control: () => 'p-2' }}
      />
    </CacheProvider>
  )
}
