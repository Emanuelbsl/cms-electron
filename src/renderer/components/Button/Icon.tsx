import React, { ButtonHTMLAttributes, forwardRef } from 'react'

import { IconContext } from '@phosphor-icons/react'

type ButtonEvent = React.MouseEvent<HTMLButtonElement>
export type Ref = HTMLButtonElement
// extends React.ButtonHTMLAttributes<HTMLButtonElement>
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType
  onClick: (event: ButtonEvent) => void
  disabled?: boolean
  propsIcon?: object
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, ...rest } = props
  return (
    <button
      type="button"
      ref={ref}
      className={`cursor-pointer dark:text-san-marino-300 dark:hover:text-san-marino-500 text-san-marino-800 hover:text-san-marino-500 font-bold rounded focus:outline-none focus:shadow-outline disabled:opacity-60 disabled:cursor-auto disabled:pointer-events-none ${className}`}
      {...rest}
    >
      <IconContext.Provider
        value={{
          size: 20,
          ...props.propsIcon,
        }}
      >
        {React.createElement(props.icon)}
      </IconContext.Provider>
    </button>
  )
})

Button.displayName = 'Button'

export default Button
