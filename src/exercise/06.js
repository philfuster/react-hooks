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
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState('idle')

  React.useEffect(() => {
    async function effect() {
      if (!Boolean(pokemonName)) {
        setStatus('idle')
        return
      }

      setError(null)
      setPokemon(null)
      setStatus('pending')
      try {
        const pokemon = await fetchPokemon(pokemonName)
        setPokemon(pokemon)
        setStatus('resolved')
      } catch (err) {
        setError(err)
        setStatus('rejected')
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
