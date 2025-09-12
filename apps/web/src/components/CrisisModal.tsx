import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CrisisModal() {
  const [isOpen, setIsOpen] = useState(false)

  // This would be triggered by crisis detection in the chat
  // For now, it's just a demo component

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <button
                    type="button"
                    className="ml-auto -mr-2 -mt-2 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Crisis Support Resources
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      It seems like you might be going through a difficult time. 
                      Please reach out to these professional resources for immediate support:
                    </p>

                    <div className="space-y-3 text-left">
                      <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                        <h4 className="font-medium text-red-800 dark:text-red-200">
                          Emergency Services
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          Call 911 for immediate emergency assistance
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">
                          National Suicide Prevention Lifeline
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Call or text 988 - Available 24/7
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          Crisis Text Line
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Text HOME to 741741 - Available 24/7
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                        <h4 className="font-medium text-purple-800 dark:text-purple-200">
                          NAMI Helpline
                        </h4>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          Call 1-800-950-NAMI (6264) for support and information
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Remember:</strong> You are not alone, and help is available. 
                        These trained professionals can provide the support you need right now.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 btn-primary"
                    onClick={() => window.open('tel:988')}
                  >
                    Call 988 Now
                  </button>
                  <button
                    type="button"
                    className="flex-1 btn-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    I'm Safe
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}