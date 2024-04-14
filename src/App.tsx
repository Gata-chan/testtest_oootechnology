import './App.scss';
import React from 'react'
import {Laptop} from 'react-bootstrap-icons'

export default function App() {
  return (
    <div className='my-app-page'>
      <Laptop color='black' size='55'/>
      <h1>Welcome to Alina Erch App!</h1>
      <h2>Made for OOO Technology</h2>
      <p>Click Home to Continue</p>
    </div>
  )
}

