/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { Pokemon } from '../types/pokemonType'
import { RootState } from '.'

export interface PokemonsState {
    data: Pokemon[]
    status: 'pending' | 'fulfilled' | 'rejected'
    page: number
    pages: number
    types: string[]
    filter: {
        type: string[]

    }
    pokedex: Record<string, Pokemon | null>;
}
const initialState: PokemonsState = {
    data: [],
    status: 'pending',
    types: [],
    page: 1,
    pages: 0,
    filter: {
        type: [],
    },
    pokedex: {}
}

export const fetchTypes = createAsyncThunk('pokemon/types', async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type')
    console.log(response.data.results);

    return response.data.results.map((t: any) => t.name)

})

export const fetchPokemons = createAsyncThunk(
    'pokemon/getAll',
    async ({ page, types }: { page: number, types: string[] }) => {


        if (types.length > 0) {

            const typePromises = types.map(type => axios.get(`https://pokeapi.co/api/v2/type/${type}`));
            const typeResponses = await Promise.all(typePromises);

            const pokemonsByType = new Set();
            typeResponses.forEach(response => {
                response.data.pokemon.forEach((pokemon: any) => {
                    pokemonsByType.add(pokemon.pokemon.url);
                });
            });

            const pokemonURLs = Array.from(pokemonsByType);

            const offset = (page - 1) * 20;
            const paginatedURLs = pokemonURLs.slice(offset, offset + 20);
            const promises = paginatedURLs.map((url: any) => axios.get(url));
            const pokemonResponses = await Promise.all(promises);
            const data: Pokemon[] = pokemonResponses.map(response => response.data);



            return {
                pages: Math.ceil(pokemonURLs.length / 20),
                data
            };
        }


        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`)
        const promises = response.data.results.map((p: any) => {
            return axios.get(p.url)
        })
        const result = await Promise.all(promises)
        const data = result.map(response => response.data);

        const filterPictures: Pokemon[] = data.filter(p => p.sprites.front_default)




        return {
            pages: Number((response.data.count / 20).toFixed(0)),
            data: filterPictures
        }
    }
)

export const fetchPokedex = createAsyncThunk('pokemon/fetchpokedex', async (_, { getState }) => {
    console.log('fetchPokemons...');

    const state = getState() as RootState
    const currentPokedex = state.pokemons.pokedex

    const pokedex: string[] = JSON.parse(localStorage.getItem('pokedex') || '[]');

    const missingPokemons = pokedex.filter(pokemonName => {
        const pokemon = currentPokedex[pokemonName];
        return pokemon === null || pokemon === undefined;

    })

    const promises = missingPokemons.map(p => {
        return axios.get('https://pokeapi.co/api/v2/pokemon/' + p)
    })

    const pokemonResponses = await Promise.all(promises);
    const data: Pokemon[] = pokemonResponses.map(response => response.data);
    const pokemonsData: Record<string, Pokemon> = {};
    data.forEach(pokemon => {
        pokemonsData[pokemon.name] = pokemon;
    });
    return pokemonsData
});

export const pokemonsSlice = createSlice({
    name: 'pokemons',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload
        },
        setFilterType: (state, action) => {
            state.filter.type = action.payload
        },
        addToPokedex: (state, action: PayloadAction<Pokemon>) => {
            const pokedex: string[] = JSON.parse(localStorage.getItem('pokedex') || '[]');
            const pokemonIndex = pokedex.indexOf(action.payload.name);

            if (pokemonIndex === -1) {
                pokedex.push(action.payload.name);
                state.pokedex[action.payload.name] = null;
            } else {
                pokedex.splice(pokemonIndex, 1);
                delete state.pokedex[action.payload.name];
            }
            localStorage.setItem('pokedex', JSON.stringify(pokedex));

        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPokemons.pending, (state) => {
            state.status = 'pending'
        })
        builder.addCase(fetchPokemons.fulfilled, (state, action) => {
            console.log(action.payload);

            state.status = 'fulfilled'
            state.data = action.payload.data
            state.pages = action.payload.pages
        })
        builder.addCase(fetchPokemons.rejected, (state) => {
            state.status = 'rejected'

        }),
            builder.addCase(fetchTypes.fulfilled, (state, action) => {
                state.types = action.payload
            }),
            builder.addCase(fetchPokedex.fulfilled, (state, action) => {


                Object.entries(action.payload).forEach(([name, details]) => {
                    if (details) {
                        state.pokedex[name] = details;
                    }
                });

            });

    },
})



export const { setPage, setFilterType, addToPokedex } = pokemonsSlice.actions

export default pokemonsSlice.reducer