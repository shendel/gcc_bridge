import { useState, useEffect } from 'react'
import AppRoot from './AppRoot'

export default function AppRootWrapper(props) {
  const {
    children,
  } = props
  return (
    <>
      <AppRoot>
        {children}
      </AppRoot>
    </>
  )
}