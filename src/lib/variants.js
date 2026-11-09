import { tv } from 'tailwind-variants'

export const cn = (...classes) => tv({ base: '' })({ class: classes })

export const badgeVariants = tv({
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors',
  variants: {
    status: {
      Aman: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      Menipis: 'bg-amber-100 text-amber-800 border border-amber-300',
      Kosong: 'bg-rose-100 text-rose-800 border border-rose-300',
    },
  },
  defaultVariants: {
    status: 'Aman',
  },
})

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  variants: {
    variant: {
      primary: 'bg-[#1859bc] hover:bg-[#124491] text-white focus:ring-[#1859bc]',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 focus:ring-slate-400',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
      outline: 'bg-transparent hover:bg-blue-50 text-[#1859bc] border border-[#1859bc] focus:ring-[#1859bc]',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
    },
    size: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const inputVariants = tv({
  base: 'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2',
  variants: {
    state: {
      default: 'border-slate-300 focus:border-[#1859bc] focus:ring-[#1859bc]/20',
      error: 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})
