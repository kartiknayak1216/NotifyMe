import React, { ReactNode } from 'react'
import Navbar from './component/navbar'

export default function layout({children}:{children:ReactNode}) {
  return (
    <div>
    <Navbar/>
    {children}</div>
  )
}
