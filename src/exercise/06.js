// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  componentDidCatch(error, info) {
    console.log(
      `Error! Handling in ErrorBoundary class. error: ${error} - info: ${info}`,
    )
  }

  render() {
    const {error, hasError} = this.state
    if (hasError) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children
  }
}

function FallbackComponent({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: 'idle',
    pokemon: null,
  }))
  const {status, pokemon} = state

  React.useEffect(() => {
    async function effect() {
      if (!Boolean(pokemonName)) {
        setState(s => ({...s, status: 'idle'}))
        return
      }

      setState(s => ({...s, error: null, pokemon: null, status: 'pending'}))
      try {
        const pokemon = await fetchPokemon(pokemonName)
        setState(s => ({...s, pokemon, error: null, status: 'resolved'}))
      } catch (err) {
        setState(s => ({...s, error: err, status: 'rejected'}))
      }
    }
    effect()
  }, [pokemonName])

  switch (status) {
    case 'idle': {
      return 'Submit a pokemon'
    }
    case 'pending': {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case 'rejected': {
      throw new Error('Error loading pokemon info!')
    }
    case 'resolved': {
      return <PokemonDataView pokemon={pokemon} />
    }
    default: {
      throw new Error(`Invalid status ${status}`)
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
