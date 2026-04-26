import React, { ReactNode } from 'react'

const CardModal = ({children}:{children:ReactNode}) => {
  return (
    <div className="bg-gray-200 dark:bg-neutral-900  lg:w-full xl:w-full max-w-md p-6 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center">
  {children}
</div>
  )
}

export default CardModal