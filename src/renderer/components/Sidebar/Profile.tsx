import useAuth from '@renderer/store/useAuth'

export function Profile() {
  const authenticated = useAuth((state) => state.authenticated)
  const username = authenticated?.user?.displayName || ''
  return (
    <button className="text-san-marino-50 dark:text-gray-50 dark:hover:text-gray-900 flex mx-5 items-center gap-2 text-sm font-medium group hover:text-san-marino-700 cursor-pointer">
      <img
        className="h-5 w-5 rounded-sm"
        src="https://avatars.githubusercontent.com/u/2254731?v=4"
        alt=""
      />
      {username}
    </button>
  )
}
