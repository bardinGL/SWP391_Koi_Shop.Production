import { useCallback, useMemo } from 'react'
import MultipleSelector, {
  Option,
  MultipleSelectorProps,
} from './shadcn-multiselect'
import { cn } from '@/lib/utils'

type MultiselectProps = Omit<MultipleSelectorProps, 'value' | 'onChange'> & {
  value?: any[]
  onChange: (value?: any[]) => void
}

const MultiSelect = ({
  value,
  onChange,
  options,
  className,
  ...props
}: MultiselectProps) => {
  const valueT = useMemo(() => {
    if (!options) return undefined
    const valueList = [] as Option[]
    for (const option of options) {
      if (value?.includes(option.value)) valueList.push(option)
    }
    return valueList
  }, [options, value])
  const onChangeT = useCallback(
    (options?: Option[]) => {
      if (!options) return onChange(undefined)
      const op = options.map((item) => item.value)
      return onChange(op)
    },
    [onChange],
  )

  return (
    <MultipleSelector
      value={valueT}
      onChange={onChangeT}
      options={options}
      className={cn(
        'w-full rounded-md border border-input bg-background pl-3 pr-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 gap-x-1',
        className,
      )}
      {...props}
    />
  )
}

export default MultiSelect
