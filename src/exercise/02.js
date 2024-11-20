// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = '', initialToggle}) {
  const [name, setName] = useLocalStorageState({
    key: 'name',
    initialValue: initialName,
  })

  const [toggle, setToggle] = useLocalStorageState({
    key: 'toggle',
    initialValue: initialToggle,
  })

  console.log(`toggle ${toggle}`)
  function handleChange(event) {
    setName(event.target.value)
  }

  function handleToggleClick() {
    setToggle(!toggle)
  }
  return (
    <div>
      <form onSubmit={event => event.preventDefault()}>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
      <div>
        <button onClick={handleToggleClick} type="button">
          Toggle me!
        </button>
        {toggle ? (
          <span
            style={{color: 'green', fontSize: '20px', fontWeight: 'bolder'}}
          >
            On!
          </span>
        ) : (
          <span style={{color: 'red', fontSize: '20px', fontWeight: 'bolder'}}>
            Off!
          </span>
        )}
      </div>
    </div>
  )
}

function useLocalStorageState({key = '', initialValue}) {
  if (key.length < 1) {
    throw new Error(`invalid key for local storage entity`)
  }
  // check local storage
  const [value, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(key)
    return storedValue !== null ? JSON.parse(storedValue) : initialValue
  })

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

function App() {
  return <Greeting initialName="Big Dawg" initialToggle={false} />
}

export default App
