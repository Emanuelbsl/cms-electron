import * as Collapsible from '@radix-ui/react-collapsible'
import * as Navigation from './Navigation'

import { CaretDoubleLeft } from '@phosphor-icons/react'
import { Footer } from './Footer'
import { Profile } from './Profile'
import { Search } from './Search'
import clsx from 'clsx'

export function Sidebar() {
  const isMacOS = process.platform === 'darwin'
  return (
    <Collapsible.Content className="bg-san-marino-500 dark:bg-gray-800 dark:border-gray-500 flex-shrink-0 border-r border-san-marino-600 h-screen relative group data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut overflow-hidden outline-border-color-700">
      <Collapsible.Trigger
        title="button-side-bar"
        type="button"
        className={clsx(
          'absolute h-5 w-5 right-4 text-san-marino-50 hover:text-san-marino-700 dark:text-gray-50 dark:hover:text-gray-900 inline-flex items-center justify-center cursor-pointer',
          {
            'top-[1.125rem]': isMacOS,
            'top-6': !isMacOS,
          },
        )}
      >
        <CaretDoubleLeft className="h-4 w-4" />
      </Collapsible.Trigger>

      <div
        className={clsx('region-drag h-14', {
          block: isMacOS,
          hidden: !isMacOS,
        })}
      ></div>

      <div
        className={clsx(
          'flex-1 flex flex-col gap-8 h-full w-[240px] group-data-[state=open]:opacity-100 group-data-[state=closed]:opacity-0 transition-opacity duration-200',
          {
            'pt-6': !isMacOS,
          },
        )}
      >
        <Profile />
        <Search />

        <Navigation.Root>
          <Navigation.Section>
            <Navigation.SectionTitle>Workspace</Navigation.SectionTitle>
            <Navigation.SectionContent>
              <Navigation.Link to="/">Home</Navigation.Link>
              <Navigation.Link to="/workflows/create">Workflow</Navigation.Link>
              <Navigation.Link to="/gamification/create">
                Gamificação
              </Navigation.Link>
              <Navigation.Link to="/gamification/create2">
                Gamificação 2
              </Navigation.Link>
            </Navigation.SectionContent>
          </Navigation.Section>
        </Navigation.Root>

        <Footer />
      </div>
    </Collapsible.Content>
  )
}
