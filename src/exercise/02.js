// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = '', initialToggle = false}) {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName,
  )
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
    console.log(
      'use effect for setting name into local storage ran during re-render.',
    )
  }, [name])

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form onSubmit={event => event.preventDefault()}>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Big Dawg" initialToggle={false} />
}

export default App
