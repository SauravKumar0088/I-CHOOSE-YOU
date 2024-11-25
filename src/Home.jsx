import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PAGE_LIMIT = 50; // Number of Pokémon per page

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0); // Pagination offset
  const [totalPokemons, setTotalPokemons] = useState(0); // Total number of Pokémon

  // Fetch Pokémon data with pagination
  const fetchPokemons = async (offset = 0, limit = PAGE_LIMIT) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      const pokemonList = response.data.results;
      setPokemons(pokemonList);
      setTotalPokemons(response.data.count);
      setFilteredPokemons(pokemonList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      setTypes(response.data.results);
    } catch (error) {
      console.error('Error fetching Pokémon types:', error);
    }
  };

  useEffect(() => {
    fetchPokemons();
    fetchTypes();
  }, []);

  const handleTypeChange = async (type) => {
    setSelectedType(type);
    setLoading(true);
    try {
      if (type === '') {
        setFilteredPokemons(pokemons);
      } else {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        const filtered = response.data.pokemon.map(p => p.pokemon);
        setFilteredPokemons(filtered);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon by type:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    if (event.target.value === '') {
      setFilteredPokemons(pokemons);
    } else {
      const filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(event.target.value.toLowerCase()));
      setFilteredPokemons(filtered);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('');
    setFilteredPokemons(pokemons);
  };

  const handlePageChange = (direction) => {
    let newOffset = offset + (direction === 'next' ? PAGE_LIMIT : -PAGE_LIMIT);
    newOffset = Math.max(0, Math.min(newOffset, totalPokemons - PAGE_LIMIT)); // Ensure offset is within bounds
    setOffset(newOffset);
    fetchPokemons(newOffset);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Pokémon List</h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-lg mb-4"
        />
        <br />
        <label htmlFor="type" className="mr-2 font-semibold">Filter by Type:</label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg mb-4"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>
        <br />
        <button
          onClick={handleReset}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-gray-700 text-center">Loading...</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPokemons.map((pokemon) => (
              <Link
                key={pokemon.name}
                to={`/pokemon/${pokemon.name}`}
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg shadow-lg p-4 text-center transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`}
                  alt={pokemon.name}
                  className="w-32 mx-auto mb-2"
                />
                <h2 className="text-xl font-semibold capitalize mb-2 text-white">{pokemon.name}</h2>
                
              </Link>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={offset === 0}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange('next')}
              disabled={offset + PAGE_LIMIT >= totalPokemons}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
