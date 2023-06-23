import { MagnifyingGlass } from '@phosphor-icons/react'

export function Search() {
  return (
    <button className="flex mx-5 items-center gap-2 text-portal-secondary-100 text-sm hover:text-portal-secondary-50">
      <MagnifyingGlass className="w-5 h-5" />
      Busca rápida
    </button>
  )
}
