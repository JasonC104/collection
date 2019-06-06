import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { withRouter } from "react-router";
import Dashboard from './Dashboard';
import GamesCollection from './GamesCollection';
import MoviesCollection from './MoviesCollection';
import './styles/main.scss';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = { items: [] };
    }

    setItems(items) {
        this.setState({ items });
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
                        <Dashboard items={this.state.items} />
                    } />
                    <Route path="/games" render={props =>
                        <GamesCollection items={this.state.items} setItems={i => this.setItems(i)} />
                    } />
                    <Route path="/movies" component={MoviesCollection} />
                </BrowserRouter>
            </div>
        );
    }
}

class NavBarComponent extends Component {
    render() {
        // all of this is just to add the is-active className to the proper element  
        const linkData = [['/', 'Dashboard'], ['/games', 'Games'], ['/movies', 'Movies']];
        const links = linkData.map(([url, name]) => {
            const activeClass = (this.props.location.pathname === url) ? 'is-active' : '';
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
}

export default Main;
