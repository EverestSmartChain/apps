import { Introduction } from "./Introduction"

export const TransferModal = () => {
    return <div className="divide-strokeGrey text-gray1 grid grid-rows-1 divide-y md:grid-cols-3 md:grid-rows-none md:divide-x md:divide-y-0">
    <div className="flex h-full flex-col justify-between px-4 pb-4 pt-5 sm:px-6 sm:py-10">
     <Introduction />
    </div>
    <div className="space-y-3 bg-white px-4 pb-4 pt-5 sm:p-10 md:col-span-2 md:px-8">
     {/* TODO: add content */}
    </div>
  </div>
}