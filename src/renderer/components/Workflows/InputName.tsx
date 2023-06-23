import { ChangeEventHandler, forwardRef, InputHTMLAttributes } from 'react'

export type Ref = HTMLInputElement

interface IinputElement extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  name?: string
}

export const InputName = forwardRef<HTMLInputElement, IinputElement>(
  (props, ref) => {
    const { defaultValue, onChange, name } = props
    return (
      <input
        ref={ref}
        name={name}
        className="font-medium w-full text-inherit inline-flex items-center flex bg-transparent p-0 focus-visible:outline-none cursor-text hover:text-portal-secondary-900"
        defaultValue={defaultValue}
        onChange={onChange}
        {...props}
      />
    )
  },
)

InputName.displayName = 'Input'
