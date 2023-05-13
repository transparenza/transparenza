import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode, useCallback } from 'react'
import { RiCloseFill as IconClose } from 'react-icons/ri'

type ModalType = 'dialog' | 'drawer' | 'fullscreen'

interface TransitionProperties {
  enter: string
  enterFrom: string
  enterTo: string
  leave: string
  leaveFrom: string
  leaveTo: string
}

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  type: ModalType
  children: ReactNode
  hideCloseButton?: boolean
  persistOnClickOutside?: boolean
  isSideMenu?: boolean
  className?: string
  preserveDOM?: boolean
}

const transitionsPerType: Record<ModalType, TransitionProperties> = {
  dialog: {
    enter: 'ease-in-out duration-350 transition-all',
    enterFrom: 'opacity-0 translate-y-[20%]',
    enterTo: 'opacity-100 translate-y-0',
    leave: 'ease-in-out duration-350 transition-all',
    leaveFrom: 'opacity-100 translate-y-0',
    leaveTo: 'opacity-0 translate-y-[20%]'
  },
  drawer: {
    enter: 'ease-in-out duration-350 transition-all',
    enterFrom: 'opacity-0 translate-x-full',
    enterTo: 'opacity-100 translate-x-0 translate-y-0',
    leave: 'ease-in-out duration-350 transition-all',
    leaveFrom: 'opacity-100 translate-x-0',
    leaveTo: 'opacity-0 translate-x-full'
  },
  fullscreen: {
    enter: 'ease-in-out duration-350 transition-all',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'ease-in-out duration-350 transition-all',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0'
  }
}

const defaultWrapperStyles: Record<ModalType, string> = {
  dialog: 'flex flex-col items-center justify-end md:justify-center',
  drawer: 'flex flex-col items-end justify-end',
  fullscreen: 'flex flex-col items-center justify-center'
}

const defaultContainerStyles: Record<ModalType, string> = {
  dialog: 'px-4 py-9 md:py-12 md:px-10 rounded-t-md md:rounded-md',
  drawer: 'grow sm:rounded-md',
  fullscreen: 'grow'
}

export default function Modal(props: ModalProps): JSX.Element {
  const {
    isOpen,
    onClose,
    type = 'dialog',
    persistOnClickOutside,
    hideCloseButton,
    isSideMenu,
    children,
    className,
    preserveDOM = false
  } = props

  const transitions = transitionsPerType[type]

  const wrapperStyles = defaultWrapperStyles[type]
  const containerStyles = defaultContainerStyles[type] + ' ' + (className || '')

  const changeBodyOverflow = useCallback((overflow: 'hidden' | 'auto') => {
    setTimeout(() => {
      document.getElementsByTagName('html')[0].style.overflow = overflow
    }, 450)
  }, [])

  return (
    <Transition
      show={isOpen}
      appear={true}
      as={Fragment}
      afterEnter={() => changeBodyOverflow('hidden')}
      afterLeave={() => changeBodyOverflow('auto')}
      unmount={!preserveDOM}
    >
      <Dialog
        onClose={() => (persistOnClickOutside ? null : onClose?.())}
        unmount={!preserveDOM}
        className={isOpen ? '' : '!flex'}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-linear duration-150 transition-all"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-linear duration-150 transition-all"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            aria-hidden="true"
            className={classNames(
              'fixed inset-0 z-20 bg-white/20 backdrop-blur-sm',
              isSideMenu ? 'max-sm:!bg-transparent max-sm:!backdrop-blur-0' : ''
            )}
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter={transitions.enter}
          enterFrom={transitions.enterFrom}
          enterTo={transitions.enterTo}
          leave={transitions.leave}
          leaveFrom={transitions.leaveFrom}
          leaveTo={transitions.leaveTo}
          unmount={!preserveDOM}
        >
          <div
            className={classNames(
              'fixed inset-0 z-30 h-full w-full overflow-auto',
              preserveDOM && '!flex',
              !isOpen && '!h-0'
            )}
          >
            <div className={classNames('flex min-h-full w-full flex-col', wrapperStyles)}>
              <Dialog.Panel
                className={classNames(
                  'relative flex w-full flex-col overflow-auto bg-black',
                  containerStyles
                )}
              >
                {!hideCloseButton && <CloseButton onClose={onClose} isSideMenu={isSideMenu} />}
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

function CloseButton(props: Partial<ModalProps>) {
  const { onClose, isSideMenu } = props

  return (
    <div
      className={classNames('absolute right-0 top-0 z-40', isSideMenu ? 'max-sm:hidden' : '')}
      onClick={onClose}
    >
      <button className="px-4 py-2" onClick={onClose}>
        <IconClose className="h-4 w-4" />
      </button>
    </div>
  )
}
