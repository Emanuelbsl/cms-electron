import { ChangeEventHandler, InputHTMLAttributes, forwardRef } from 'react'

export type Ref = HTMLInputElement

interface IinputElement extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  defaultValue?: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  name?: string
  checked?: boolean
}

export const Toggle = forwardRef<Ref, IinputElement>((props, ref) => {
  const { label, defaultValue, onChange, name, checked } = props
  return (
    <label className="relative inline-flex items-center mb-2 mt-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        name={name}
        className="sr-only peer"
        id={label}
        defaultValue={defaultValue}
        onChange={onChange}
        checked={checked}
        {...props}
      />
      <div className="w-9 h-5 bg-portal-primary-200 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-portal-primary-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-al peer-checked:bg-portal-primary-600"></div>
      <span className="ml-3 text-sm font-medium text-portal-secondary-900 ">
        {label}
      </span>
    </label>
  )
})
