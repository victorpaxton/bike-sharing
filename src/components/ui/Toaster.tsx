import { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { XIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

let addToast: (type: ToastType, message: string) => void = () => {};

export function toast(type: ToastType, message: string) {
  addToast(type, message);
}

export function Toaster({ position = 'bottom-right' }: ToasterProps) {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    addToast = (type: ToastType, message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToastList((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToastList((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
    };
  }, []);

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <div
      className={`fixed z-50 m-8 flex flex-col gap-4 ${positionClasses[position]}`}
    >
      {toastList.map((toast) => (
        <Transition
          key={toast.id}
          show={true}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' ? (
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.message}
                  </p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => {
                      setToastList((prev) =>
                        prev.filter((t) => t.id !== toast.id)
                      );
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
} 