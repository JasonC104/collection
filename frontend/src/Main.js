import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import Dashboard from './Dashboard';
import GamesCollection from './GamesCollection';
import MoviesCollection from './MoviesCollection';
import { GamesApi } from './api';
import './styles/main.scss';

function Main() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        GamesApi.getItems({}, response => setGames(response));
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
                        <Dashboard {...props} games={games} />
                    } />
                    <Route path="/games" render={props =>
                        <GamesCollection games={games} setGames={setGames} />
                    } />
                    <Route path="/movies" component={MoviesCollection} />
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
