import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.cjs'

const fullConfig = resolveConfig(tailwindConfig)

export function useTailwindColors() {
  return fullConfig.theme?.colors
}

export function useTailwindConfig() {
  return fullConfig
}
