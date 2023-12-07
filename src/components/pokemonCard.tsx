
import { Box, Grid, Typography } from '@mui/material';
import '../css/pokemonCard.css';
import { Pokemon, PokemonTypeColors } from '../types/pokemonType';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { addToPokedex, fetchPokedex } from '../store/pokemons';
import { useAppDispatch } from '../store';

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {

    const dispatch = useAppDispatch()
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFavorite, setIsFavorite] = useState(
        (JSON.parse(localStorage.getItem('pokedex') || '[]') as string[]).some(p => p === pokemon.name)
    );

    const bgColors: PokemonTypeColors = {
        bug: '#3c9950',
        dark: '#595761',
        dragon: '#0c6ac8',
        electric: '#f2d94e',
        fairy: '#ee90e6',
        fighting: '#d3425f',
        fire: '#fba54c',
        flying: '#a1bbec',
        ghost: '#5f6dbc',
        grass: '#5fbd58',
        ground: '#da7c4d',
        ice: '#75d0c1',
        normal: '#a0a29f',
        poison: '#b763cf',
        psychic: '#fa8581',
        rock: '#c9bb8a',
        steel: '#5695a3',
        water: '#539ddf'
    };

    const getBorderColor: PokemonTypeColors = {
        bug: '#1a4b23',
        dark: '#2d2d36',
        dragon: '#063b67',
        electric: '#72660f',
        fairy: '#613553',
        fighting: '#66192b',
        fire: '#7f5625',
        flying: '#384467',
        ghost: '#1c1e35',
        grass: '#2c5e2d',
        ground: '#704127',
        ice: '#264b43',
        normal: '#656565',
        poison: '#663970',
        psychic: '#4f2b2c',
        rock: '#6a5f43',
        steel: '#233f42',
        water: '#224363'
    }

    const onClickaddToPokedex = () => {
        if (isFavorite) {
            dispatch(addToPokedex(pokemon));
        } else {
            dispatch(addToPokedex(pokemon));
            dispatch(fetchPokedex());
        }
        setIsFavorite(!isFavorite);
    };


    return (
        <Grid item xs={12} sm={6} lg={3} xl={2} onClick={() => setIsFlipped(!isFlipped)} className={`card ${isFlipped ? 'is-flipped' : ''}`}>


            <div className="card-front">
                <Box sx={{ border: `5px solid ${getBorderColor[pokemon.types[0].type.name as keyof PokemonTypeColors]}`, position: 'relative' }} bgcolor={bgColors[pokemon.types[0].type.name as keyof PokemonTypeColors]} className="pokemon-card" >
                    <Box sx={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                        <StarIcon sx={{
                            ":hover": {
                                cursor: 'pointer'
                            },
                            color: isFavorite ? 'yellow' : 'rgba(0, 0, 0, 0.8)',
                            opacity: isFavorite ? 1 : 0.5
                        }} onClick={(e) => {
                            e.stopPropagation();

                            onClickaddToPokedex()
                        }} />
                    </Box>

                    <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
                    <Typography color={`${getBorderColor[pokemon.types[0].type.name as keyof PokemonTypeColors]}`} fontFamily={'cursive'} variant='h4' className="pokemon-name" > {pokemon.name.toUpperCase()} </ Typography>
                    < div className="pokemon-info" >
                        <p><strong>ID: </strong> {pokemon.id}</p >
                        <p><strong>Height: </strong> {pokemon.height} dm</p >
                        <p><strong>Weight: </strong> {pokemon.weight} hg</p >
                        <p><strong>Types: </strong> {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p >
                    </div>
                </Box>
            </div>
            <div className="card-back">
                <Box
                    sx={{
                        border: `5px solid ${getBorderColor[pokemon.types[0].type.name as keyof PokemonTypeColors]}`,
                        bgcolor: bgColors[pokemon.types[0].type.name as keyof PokemonTypeColors],
                    }}
                    className="pokemon-card"
                >
                    <img src={pokemon.sprites.back_default} alt={pokemon.name} className="pokemon-image" />
                    <Typography
                        color={`${getBorderColor[pokemon.types[0].type.name as keyof PokemonTypeColors]}`}
                        fontFamily={'cursive'}
                        variant='h4'
                        className="pokemon-name"
                    >
                        {pokemon.name.toUpperCase()}
                    </Typography>
                    <div className="pokemon-info">

                        <p><strong>Height: </strong> {pokemon.height} dm</p>
                        <p><strong>Weight: </strong> {pokemon.weight} hg</p>
                        <p><strong>Types: </strong> {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                        <p><strong>Abilities: </strong> {pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
                    </div>
                </Box>
            </div>





        </Grid>


    )
}


