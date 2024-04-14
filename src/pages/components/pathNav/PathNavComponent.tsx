import React from 'react'
import './PathNavStyles.scss'

function PathNavComponent(props) {
  return (
    <nav className='path-nav-component'>
        <div>
            <p><a href='/user/index'>Home</a> / {props.path}</p>
        </div>
    </nav>
  )
}

export default PathNavComponent