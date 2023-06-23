import BtnDarkMode from '@renderer/components/BtnDarkMode'

export function Footer() {
  return (
    <div className="flex justify-center w-[220px] px-3 items-center gap-2 absolute bottom-0 left-[10px] right-0 py-2 border-t border-san-marino-400 dark:border-gray-500 disabled:opacity-60">
      <BtnDarkMode />
    </div>
  )
}
