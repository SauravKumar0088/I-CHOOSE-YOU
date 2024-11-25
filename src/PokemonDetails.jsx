import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(response.data);
      console.log(response.data); // Debugging line to check API response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error); // Log error for debugging
      setError('Pokémon not found');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [name]);

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
      <h1 className="text-4xl font-bold mb-4 capitalize">{name}</h1>

{loading ? (
  <p className="text-gray-700">Loading...</p>
) : error ? (
  <p className="text-red-500">{error}</p>
) : pokemon ? (
          <div>
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-48 mx-auto mb-4 transition-transform duration-500 hover:scale-110"
            />
            <div className="text-left mb-4">
              <p className="text-lg font-semibold mb-2">Height: <span className="text-gray-600">{pokemon.height / 10} m</span></p>
              <p className="text-lg font-semibold mb-2">Weight: <span className="text-gray-600">{pokemon.weight / 10} kg</span></p>
              <p className="text-lg font-semibold mb-2">Base Experience: <span className="text-gray-600">{pokemon.base_experience}</span></p>
              <p className="text-lg font-semibold mb-2">Abilities: <span className="text-gray-600">{pokemon.abilities.map((ability) => ability.ability.name).join(', ')}</span></p>
              <p className="text-lg font-semibold mb-2">Types: <span className="text-gray-600">{pokemon.types.map((type) => type.type.name).join(', ')}</span></p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Back
            </button>
          </div>
        ) : (
          <p className="text-gray-700">No Pokémon data</p>
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
