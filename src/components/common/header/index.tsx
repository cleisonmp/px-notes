import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cx from 'classix'
import { Transition } from '@headlessui/react'
import ScrollLock, { TouchScrollable } from 'react-scrolllock'

import type { Languages } from '../../../@types/languages'
import { Logo } from '../logo'
import { LanguageLink } from './languageLink'
import { PageLink } from './pageLink'
import { HamburgerMenuButton } from './menuButton'

const Sizes = {
  lg: { width: 520, height: 283 },
  md: { width: 348, height: 190 },
  sm: { width: 176, height: 96 },
}

interface HeaderProps {
  logoSize?: 'lg' | 'md' | 'sm'
  autoResizeLogo?: boolean
}
type ActivePage = 'home' | 'about'

export const Header = ({ logoSize, autoResizeLogo = false }: HeaderProps) => {
  const [activePage, setActivePage] = useState<ActivePage>('home')
  const [activeLanguage, setActiveLanguage] = useState<Languages>('de')
  //const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpenState)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const router = useRouter()

  const logoWidth =
    logoSize === 'lg'
      ? Sizes.lg.width
      : logoSize === 'md'
      ? Sizes.md.width
      : Sizes.sm.width
  const logoHeight =
    logoSize === 'lg'
      ? Sizes.lg.height
      : logoSize === 'md'
      ? Sizes.md.height
      : Sizes.sm.height

  const toggleMenuState = () => {
    setIsMenuOpen((state) => !state)
  }

  useEffect(() => {
    if (router.asPath === '/about') {
      setActivePage('about')
    }
  }, [router])

  return (
    <header className='fixed top-0 left-0 z-9999 flex w-full select-none flex-col items-start justify-between bg-app-background lg:static lg:flex-row lg:bg-transparent'>
      <div className='w-full lg:hidden'>
        <div className='relative w-full p-2'>
          <div className='absolute -z-9999 flex h-full w-full items-center justify-center'>
            <Logo width={70} height={38} />
          </div>

          <HamburgerMenuButton
            isOpen={isMenuOpen}
            className=''
            aria-controls='navigation'
            aria-expanded={isMenuOpen}
            onClick={toggleMenuState}
          />
        </div>
        <div className='relative'>
          <Transition
            as={Fragment}
            show={isMenuOpen}
            enter='transition ease-out'
            enterFrom='transform opacity-0 -translate-x-full'
            enterTo='transform scale-100 opacity-100'
            leave='transition ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform opacity-0 -translate-x-full'
          >
            <div
              onClick={toggleMenuState}
              className='absolute left-0 flex h-screen w-full bg-black opacity-70 backdrop-blur-3xl'
            ></div>
          </Transition>

          <Transition
            as={Fragment}
            show={isMenuOpen}
            enter='transition ease-out'
            enterFrom='transform opacity-0 -translate-x-full'
            enterTo='transform scale-100 opacity-100'
            leave='transition ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform opacity-0 -translate-x-full'
          >
            <div className='absolute left-0 h-screen w-[80vw] bg-app-background'>
              <ScrollLock isActive={isMenuOpen} />
              <TouchScrollable>
                <nav className='mt-2 flex flex-col justify-between gap-20'>
                  <ul className='flex flex-col gap-2'>
                    <li
                      className={cx(
                        'mx-2 rounded-lg px-5 py-2',
                        activePage === 'home' && 'bg-app-backgroundLight',
                      )}
                    >
                      <PageLink
                        title='home'
                        href='/'
                        isActive={activePage === 'home'}
                      />
                    </li>
                    <li
                      className={cx(
                        'mx-2 rounded-lg px-5 py-2',
                        activePage === 'about' && 'bg-app-backgroundLight',
                      )}
                    >
                      <PageLink
                        title='about us'
                        href='/about'
                        isActive={activePage === 'about'}
                      />
                    </li>
                  </ul>
                  <ul className='mx-2 flex items-center gap-3 rounded-lg px-5 py-2'>
                    <span>Language:</span>
                    <li>
                      <LanguageLink
                        flag='de'
                        isActive={activeLanguage === 'de'}
                      />
                    </li>
                    <li>
                      <LanguageLink
                        flag='uk'
                        isActive={activeLanguage === 'uk'}
                      />
                    </li>
                    <li>
                      <LanguageLink
                        flag='br'
                        isActive={activeLanguage === 'br'}
                      />
                    </li>
                  </ul>
                </nav>
              </TouchScrollable>
            </div>
          </Transition>
        </div>
      </div>
      <div className='hidden lg:contents'>
        <Logo width={logoWidth} height={logoHeight} />
        <nav className='flex items-center justify-between gap-20'>
          <ul className='flex items-center gap-2'>
            <li>
              <PageLink
                title='home'
                href='/'
                isActive={activePage === 'home'}
              />
            </li>
            <li>
              <PageLink
                title='about us'
                href='/about'
                isActive={activePage === 'about'}
              />
            </li>
          </ul>
          <ul className='flex items-center gap-2'>
            <li>
              <LanguageLink flag='de' isActive={activeLanguage === 'de'} />
            </li>
            <li>
              <LanguageLink flag='uk' isActive={activeLanguage === 'uk'} />
            </li>
            <li>
              <LanguageLink flag='br' isActive={activeLanguage === 'br'} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
