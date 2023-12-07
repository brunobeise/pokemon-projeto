import { useEffect, useState } from "react";
import "./App.css";
import { fetchPokedex, fetchPokemons, fetchTypes, setPage } from "./store/pokemons";
import { useAppDispatch, useAppSelector } from "./store";
import PokemonCard from "./components/pokemonCard";
import { Box, Grid, LinearProgress, Pagination, AppBar, Toolbar, Typography } from '@mui/material';
import TypeSelect from "./components/TypeSelect";
import Pokedex from './assets/pokedex.webp'
import { Pokemon } from "./types/pokemonType";

function App() {
  const pokemons = useAppSelector((state) => state.pokemons);
  const [pokedex, setPokedex] = useState(false)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPokedex())
  }, [])

  console.log(pokemons.pokedex);

  useEffect(() => {
    dispatch(fetchPokemons({ page: pokemons.page, types: pokemons.filter.type }));
    if (pokemons.types.length === 0) dispatch(fetchTypes())
  }, [dispatch, pokemons.filter.type, pokemons.page, pokemons.types.length]);


  return (
    <>
      <AppBar position="static" sx={{ mb: 5 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PokeApi by brunobeise eterno tech helper
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{
        cursor: 'pointer',
        filter: !pokedex ? 'grayscale(70%)' : '',
        position: 'absolute',
        top: '1rem',
        left: '1rem'
      }}
        onClick={() => setPokedex(!pokedex)}
      >
        <img style={{ width: '80px' }} src={Pokedex} alt="" />

      </Box>
      {


        pokemons.status === 'fulfilled' ?
          <>
            <Grid container display={'flex'} flexWrap={'wrap'} justifyContent={'center'}>
              {!pokedex && <Pagination sx={{ justifyContent: 'center', marginBottom: '2rem' }} disabled={pokemons.status !== 'fulfilled'} page={pokemons.page} onChange={(_e, v) => dispatch(setPage(v))} count={pokemons.pages} variant="outlined" shape="rounded" />}

              {!pokedex &&
                <Grid item xs={12}>
                  <TypeSelect types={pokemons.types} value={pokemons.filter.type} />

                </Grid>
              }

              {!pokedex ?
                <Grid container display={'flex'} justifyContent={'center'} gap={2}>

                  {pokemons.data.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}

                </Grid>
                :
                <Grid container display={'flex'} justifyContent={'center'} gap={2}>

                  {(Object.values(pokemons.pokedex).filter(pokemon => pokemon !== null) as Pokemon[]).map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}



                </Grid>

              }


              {!pokedex && <Pagination sx={{ justifyContent: 'center', marginTop: '2rem' }} disabled={pokemons.status !== 'fulfilled'} page={pokemons.page} onChange={(_e, v) => dispatch(setPage(v))} count={pokemons.pages} variant="outlined" shape="rounded" />}


            </Grid>
          </> :
          <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'}>
            <Pagination sx={{ justifyContent: 'center', marginBottom: '2rem' }} disabled={true} page={pokemons.page} onChange={(_e, v) => dispatch(setPage(v))} count={pokemons.pages} variant="outlined" shape="rounded" />
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
            </Box>

          </Box>
      }
    </>


  )
}

export default App;
