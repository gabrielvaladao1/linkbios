'use client'

import { useState } from 'react'

interface PasswordInputProps {
  id: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  minLength?: number
  label: string
  labelRight?: React.ReactNode
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  minLength,
  label,
  labelRight,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={show ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          tabIndex={-1}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? (
            /* Eye Off icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            /* Eye icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
