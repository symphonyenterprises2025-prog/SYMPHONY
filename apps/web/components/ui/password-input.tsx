'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

/**
 * Drop-in replacement for <Input type="password" /> with a built-in
 * eye toggle. Renders the input with right padding to make room for
 * the toggle button. The button has tabIndex={-1} so tab order skips
 * it; pressing Tab on the password field moves to the next form
 * control, not to the toggle.
 *
 * The component keeps the input as a normal controlled/uncontrolled
 * input, so all existing form wiring (react-hook-form, native FormData,
 * etc.) works without changes.
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    const [show, setShow] = React.useState(false)
    return (
      <div className={cn('relative', wrapperClassName)}>
        <Input
          type={show ? 'text' : 'password'}
          className={cn('pr-11', className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          title={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus-visible:text-slate-700"
        >
          {show ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
