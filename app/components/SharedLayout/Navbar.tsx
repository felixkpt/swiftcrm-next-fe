import { appConfig } from '@/app/utils/helpers'
import React from 'react'
import Toggler from './Sidebar/Toggler'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Toggler action={'toggle'} />
        <a className="btn btn-ghost text-xl">{appConfig.name}</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Item 1</a></li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </details>
          </li>
          <li><a>Item 3</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  )
}

export default Navbar