import { ChangeEventHandler, InputHTMLAttributes, forwardRef } from 'react'

export type Ref = HTMLInputElement

interface IinputElement extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  defaultValue?: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  name?: string
}

export const Input = forwardRef<Ref, IinputElement>((props, ref) => {
  const { label, defaultValue, onChange, name } = props
  return (
    <fieldset className="inline-grid w-full">
      {label && (
        <label
          className="text-sm w-full text-portal-secondary-900"
          htmlFor={label}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        name={name}
        className="w-auto text-portal-secondary-900 items-center flex bg-portal-secondary-100 rounded-sm pl-4 pr-4 p-0 text-sm shadow-[0_0_0_1px_rgba(208,184,168)]"
        id={label}
        defaultValue={defaultValue}
        onChange={onChange}
        {...props}
      />
    </fieldset>
  )
})

Input.displayName = 'Input'
