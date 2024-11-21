// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
      <button onClick={() => resetErrorBoundary()}>Try again!</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: pokemonName ? 'pending' : 'idle',
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

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
