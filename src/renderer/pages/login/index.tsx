import { Eye, EyeSlash } from '@phosphor-icons/react'
import { RefObject, useEffect, useRef, useState } from 'react'

import BtnDarkMode from '@renderer/components/BtnDarkMode'
import Button from '@renderer/components/Button/Action'
import useAuth from '@renderer/store/useAuth'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

const defaultError = {
  password: false,
  username: false,
  message: '',
  open: false,
}

const urlJeffUrl = '../../assets/images/jeff.png'
const imgJeffUrl = new URL(urlJeffUrl, import.meta.url).href

const urlStars = '../../assets/images/background/stars.png'
const urlMoon = '../../assets/images/background/moon.png'
const urlMountainsBehindDark =
  '../../assets/images/background/mountains_behind_dark.png'
const urlMountainsFrontDark =
  '../../assets/images/background/mountains_front_dark.png'
const urlSun = '../../assets/images/background/sun.png'
const urlMountainsBehindLight =
  '../../assets/images/background/mountains_behind_light.png'
const urlMountainsFrontLight =
  '../../assets/images/background/mountains_front_light.png'

const stars = new URL(urlStars, import.meta.url).href
const moon = new URL(urlMoon, import.meta.url).href
const mountainsBehindDark = new URL(urlMountainsBehindDark, import.meta.url)
  .href
const mountainsFrontDark = new URL(urlMountainsFrontDark, import.meta.url).href

const sun = new URL(urlSun, import.meta.url).href
const mountainsBehindLight = new URL(urlMountainsBehindLight, import.meta.url)
  .href
const mountainsFrontLight = new URL(urlMountainsFrontLight, import.meta.url)
  .href

export function Login() {
  const login = useAuth((state) => state.login)
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const navigate = useNavigate()
  const usernameRef = useRef(null) as RefObject<HTMLInputElement>
  const passwordRef = useRef(null) as RefObject<HTMLInputElement>
  const [error, setError] = useState({
    ...defaultError,
  })
  const [visible, setVisible] = useState(false)

  const { isLoading, mutateAsync } = useMutation(
    async ({ username, password }: { username: string; password: string }) => {
      const response = await window.api.fetchAuthenticationAd({
        username,
        password,
      })
      return response
    },
    {
      onSuccess: async ({ success, message, authenticated }) => {
        if (!success) {
          setError((prev) => ({
            ...prev,
            username: true,
            password: true,
            message: String(message),
            open: true,
          }))
          return
        }
        login(authenticated)
      },
    },
  )

  useEffect(() => {
    const timerToast = setTimeout(() => {
      setError((prev) => ({ ...prev, open: false }))
    }, 5000)

    return () => {
      clearTimeout(timerToast)
    }
  }, [error?.open])

  useEffect(() => {
    isAuthenticated && navigate('/')
  }, [isAuthenticated, navigate])

  const handleAuthenticationAd = async () => {
    const username = usernameRef?.current!.value || ''
    const password = passwordRef?.current!.value || ''
    if (username.trim() && password.trim()) {
      setError(defaultError)
      return await mutateAsync({ username, password })
    }
    setError((prev) => ({
      ...prev,
      username: !username.trim(),
      password: !password.trim(),
      message: 'Todos os campos são obrigatórios!',
      open: true,
    }))
  }

  return (
    <section className="relative flex justify-between w-full h-full overflow-hidden bg-gradient-to-br from-[#9dc3f9] to-[#ffffd4]  dark:from-[#2b1055] dark:to-[#7597de] transition-all duration-700">
      <ImagensBackground />

      <div className="flex-1 flex items-center justify-center h-screen outline-secondary-color-700 rounded region-no-drag select-none">
        <div className="w-full max-w-sm flex flex-col items-center">
          <form className="relative transparent-white rounded px-8 pt-6 pb-8 mb-4 border border-solid border-[#ffffff26] border-l-[#ffffff40] border-b-[#ffffff40] shadow-md">
            <div className="mb-4">
              <label className="block text-san-marino-700  dark:text-san-marino-100 text-sm font-bold mb-2">
                Username
              </label>
              <input
                ref={usernameRef}
                className={clsx(
                  'bg-san-marino-100 border-san-marino-400 border border-solid appearance-none rounded w-auto py-2 px-3 pr-[30px] text-san-marino-700 leading-tight  placeholder-san-marino-300',
                  {
                    'border-red-500': error?.username,
                  },
                )}
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-san-marino-700  dark:text-san-marino-100 text-sm font-bold mb-2">
                Password
              </label>
              <div className="flex flex-wrap items-stretch w-full relative h-15 items-center">
                <input
                  ref={passwordRef}
                  className={clsx(
                    ' bg-san-marino-100 appearance-none border-san-marino-400 border border-solid rounded w-auto py-2 px-3 pr-[30px] text-san-marino-700 mb-3 leading-tight placeholder-san-marino-300',
                    {
                      'border-red-500': error?.password,
                    },
                  )}
                  id="password"
                  type={visible ? 'text' : 'password'}
                  placeholder="******************"
                />
                <span
                  className="text-san-marino-400 absolute top-2 right-2 cursor-pointer"
                  onClick={() => setVisible((state) => !state)}
                >
                  {visible ? (
                    <Eye size={20} weight="bold" />
                  ) : (
                    <EyeSlash size={20} weight="bold" />
                  )}
                </span>
              </div>

              {error?.password && (
                <p className="text-red-500 text-xs italic text-center">
                  {error?.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <Button
                loading={isLoading}
                name="Entrar"
                onClick={() => handleAuthenticationAd()}
              />
            </div>
          </form>
          <p className="text-center text-san-marino-50 text-xs z-10">
            &copy;2023 jeff Corp.
          </p>
        </div>
      </div>
      <div
        className={clsx('absolute right-0 bottom-0 m-2  overflow-hidden', {
          'toast-login-disabled': error?.open,
          'toast-login-active': !error?.open,
        })}
        role="alert"
      >
        <div className="flex items-center">
          <img src={imgJeffUrl} alt="jeff" width={120} />
        </div>
      </div>
      <div className="absolute left-1 bottom-1 opacity-60 hover:opacity-100 border rounded-lg dark:border-gray-400 border-san-marino-50">
        <BtnDarkMode />
      </div>
    </section>
  )
}

function ImagensBackground() {
  return (
    <>
      <img
        src={stars}
        alt="stars"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 dark:opacity-100 transition-all duration-700"
      />
      <img
        src={moon}
        alt="moon"
        className="absolute top-0 left-0 w-full h-full object-cover mix-blend-screen opacity-0 dark:opacity-100 transition-all duration-700 animate-moonOut  dark:animate-moonIn"
      />
      <img
        src={sun}
        alt="sun"
        className="absolute top-0 left-0 w-full h-full object-cover mix-blend-screen opacity-100 dark:opacity-0 transition-all duration-700 animate-sunIn  dark:animate-sunOut"
      />
      <img
        src={mountainsBehindDark}
        alt="mountains_behind"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 dark:opacity-100 transition-all duration-700"
      />
      <img
        src={mountainsBehindLight}
        alt="mountains_behind"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100 dark:opacity-0 transition-all duration-700"
      />
      <img
        src={mountainsFrontDark}
        alt="mountains_front"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 dark:opacity-100 transition-all duration-700"
      />
      <img
        src={mountainsFrontLight}
        alt="mountains_front"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100 dark:opacity-0 transition-all duration-700"
      />
    </>
  )
}
