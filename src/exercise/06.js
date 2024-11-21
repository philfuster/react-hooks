// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: 'idle',
    pokemon: null,
    error: null,
  }))
  const {status, pokemon, error} = state

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
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
