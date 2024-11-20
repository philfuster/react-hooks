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

  const defaultDogState = {
    name: 'Ryan',
    breed: 'Puggle',
    age: 5,
  }

  const [dogState, setDogState] = useLocalStorageState({
    key: 'dog',
    initialValue: defaultDogState,
  })

  function handleNameChange(event) {
    setName(event.target.value)
  }

  function handleDogNameChange(event) {
    setDogState({
      ...dogState,
      name: event.target.value,
    })
  }

  function handleDogBreedChange(event) {
    setDogState({
      ...dogState,
      breed: event.target.value,
    })
  }

  function handleDogAgeChange(event) {
    setDogState({
      ...dogState,
      age: event.target.value,
    })
  }

  function handleToggleClick() {
    setToggle(!toggle)
  }
  return (
    <div>
      <form onSubmit={event => event.preventDefault()}>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleNameChange} id="name" />
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          columnGap: '10px',
        }}
      >
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>Name</h3>
          <input value={dogState.name} onChange={handleDogNameChange} />
        </section>
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>Breed</h3>
          <input value={dogState.breed} onChange={handleDogBreedChange} />
        </section>
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>Age</h3>
          <input
            type="number"
            value={dogState.age}
            onChange={handleDogAgeChange}
          />
        </section>
      </div>
    </div>
  )
}

function useLocalStorageState({
  key = '',
  initialValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}) {
  if (key.length < 1) {
    throw new Error(`invalid key for local storage entity`)
  }
  // check local storage
  const [value, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue !== null) {
      return deserialize(storedValue)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    window.localStorage.setItem(key, serialize(value))
  }, [value, key, serialize])

  return [value, setValue]
}

function App() {
  return <Greeting initialName="Big Dawg" initialToggle={false} />
}

export default App
