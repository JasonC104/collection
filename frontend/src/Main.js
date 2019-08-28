import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import Dashboard from './Dashboard';
import GamesCollection from './GamesCollection';
import MoviesCollection from './MoviesCollection';
import { GamesApi, MoviesApi } from './api';
import './styles/main.scss';

function Main() {
    const [games, setGames] = useState([]);
    const [movies, setMovies] = useState([]);
    const [gamesFilters, setGamesFilters] = useState({});
    const getGames = (filters) => {
        if (filters) setGamesFilters(filters);
        else filters = gamesFilters;
        return GamesApi.getItems(filters, response => setGames(response));
    }
    useEffect(() => {
        GamesApi.getItems({}, response => setGames(response));
        MoviesApi.getItems({}, response => setMovies(response));
    }, []);

    const NavBar = withRouter(NavBarComponent);
    return (
        <div className='main'>
            <BrowserRouter>
                <div className='header'>
                    <h1 className='title is-marginless'>Collection</h1>
                    <NavBar />
                </div>
                <Switch>
                    <Route path="/" exact render={props =>
                        <Dashboard {...props} getGames={getGames} />
                    } />
                    <Route path="/games" render={() =>
                        <GamesCollection games={games} getGames={getGames} />
                    } />
                    <Route path="/movies" render={() =>
                        <MoviesCollection movies={movies} setMovies={setMovies} />
                    } />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

function NavBarComponent(props) {
    // all of this is just to add the is-active className to the proper tab  
    const linkData = [['/', 'Dashboard'], ['/games', 'Games'], ['/movies', 'Movies']];
    const links = linkData.map(([url, name]) => {
        const activeClass = (props.location.pathname === url) ? 'is-active' : '';
        return (
            <li key={url} className={activeClass}>
                <Link to={url}>{name}</Link>
            </li>
        );
    });

    return (
        <nav className="tabs is-boxed" >
            <ul>
                {links}
            </ul>
        </nav>
    );
}

export default Main;
