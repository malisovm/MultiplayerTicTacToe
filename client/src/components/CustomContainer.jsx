import React from 'react'

export default function CustomContainer({ children }) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
      style={{ marginTop: '-100px' }}
    >
      {children}
    </div>
  )
}