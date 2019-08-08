import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { Actions } from './actions';
import Dashboard from './Dashboard';
import GamesCollection from './GamesCollection';
import MoviesCollection from './MoviesCollection';
import { GamesApi } from './api';
import './styles/main.scss';

class Main extends Component {

    componentDidMount() {
        GamesApi.getItems({}, response => {
            this.props.setGames(response);
        });
    }

    render() {
        const NavBar = withRouter(NavBarComponent);
        return (
            <div className='main'>
                <BrowserRouter>
                    <div className='header'>
                        <h1 className='title is-marginless'>Collection</h1>
                        <NavBar />
                    </div>
                    <Route path="/" exact render={props =>
                        <Dashboard {...props} />
                    } />
                    <Route path="/games" render={props =>
                        <GamesCollection />
                    } />
                    <Route path="/movies" component={MoviesCollection} />
                </BrowserRouter>
            </div>
        );
    }
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

function mapDispatchToProps(dispatch) {
    return {
        setGames: (games) => dispatch(Actions.setGames(games))
    };
}

export default connect(null, mapDispatchToProps)(Main);
