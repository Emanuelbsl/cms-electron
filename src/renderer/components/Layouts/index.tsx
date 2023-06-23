import * as Collapsible from '@radix-ui/react-collapsible'

import { ReactNode, useState } from 'react'

import { Header } from '@renderer/components/Header'
import { Sidebar } from '@renderer/components/Sidebar'

function Default({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  return (
    <Collapsible.Root
      defaultOpen
      onOpenChange={setIsSidebarOpen}
      className="h-screen w-screen text-san-marino-700 dark:text-gray-50 flex outline-san-marino-700"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header isSidebarOpen={isSidebarOpen} />
        {children}
      </div>
    </Collapsible.Root>
  )
}

export default Default
