import React, { InputHTMLAttributes } from 'react'

import { IconContext } from '@phosphor-icons/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  propsIcon?: object
  icon: React.ComponentType
  tooltip: string
}

const InputFiles = (props: InputProps) => {
  const { className, ...rest } = props
  return (
    <div className="group flex relative">
      <div
        className={`text-san-marino-800 hover:text-portal-primary-700 dark:text-san-marino-300 dark:hover:text-san-marino-500 font-bold rounded focus:outline-none focus:shadow-outline ${className}`}
      >
        <label className="flex flex-col items-center p-1 tracking-wide uppercase cursor-pointer">
          <IconContext.Provider
            value={{
              size: 20,
              ...props.propsIcon,
            }}
          >
            {React.createElement(props.icon)}
          </IconContext.Provider>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            {...rest}
          />
        </label>
      </div>
      <div
        className="group-hover:opacity-100 transition-opacity bg-gray-700 px-2 text-sm text-gray-100 rounded-md absolute left-1/2 
        -translate-x-1/2 translate-y-full opacity-0 m-3 mx-auto whitespace-nowrap shadow-sm  border border-gray-400"
      >
        {props.tooltip}
      </div>
    </div>
  )
}

InputFiles.displayName = 'Input'

export default InputFiles
