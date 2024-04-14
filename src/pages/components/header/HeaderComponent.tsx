import React from 'react'
import "./HeaderStyles.scss"

function HeaderComponent() {
  return (
    <header className='header'>
        <nav>
            <ul>
                <li><a key="myapp" href='/'><h3>My application</h3></a></li>
                <li><a key="home" href='/user/index'><p>Home</p></a></li>
            </ul>
        </nav>
    </header>
  )
}

export default HeaderComponent