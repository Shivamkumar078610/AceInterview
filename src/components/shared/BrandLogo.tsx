import React from 'react'

interface BrandLogoProps {
  className?: string
}

export function BrandLogo({ className = 'w-6 h-6' }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C15.5 6.5 20.5 10.5 20.5 14.5C20.5 18.5 17 21 13.5 21C12.5 21 12 20.5 12 20.5C12 20.5 11.5 21 10.5 21C7 21 3.5 18.5 3.5 14.5C3.5 10.5 8.5 6.5 12 2ZM12 7.5L13.25 10.85L16.75 11.05L14.1 13.25L14.9 16.65L12 14.85L9.1 16.65L9.9 13.25L7.25 11.05L10.75 10.85L12 7.5ZM12 20C12 20 10.5 21.5 9 22.5H15C13.5 21.5 12 20 12 20Z"
      />
    </svg>
  )
}
