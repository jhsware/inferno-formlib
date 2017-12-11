import Inferno from 'inferno'
import Component from 'inferno-component'
import { Router, Route, Redirect, IndexRoute, Link } from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'

import Button from 'inferno-bootstrap/lib/Button'

import Nav from 'inferno-bootstrap/lib/Navigation/Nav'
import NavItem from 'inferno-bootstrap/lib/Navigation/NavItem'

import DatePage from './DatePage'

function NavLink (props) {
  return (
    <Link activeClassName="active" className="nav-link" to={props.to}>{props.children}</Link>
  )
}

class AppLayout extends Component {
  render () {
    return (
      <div className="Content">
        <Nav>
          <NavItem>
            <NavLink to="/date">Date Widget</NavLink>
          </NavItem>
        </Nav>
        {this.props.children}
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  require('inferno-devtools')
  const browserHistory = createBrowserHistory()

  const appRoutes = (
    <Router history={ browserHistory }>
      <Route path="/date" component={ AppLayout }>
        <IndexRoute component={ DatePage } />
      </Route>
      <Redirect from="/*" to="/date" />
    </Router>
  )
  Inferno.render(appRoutes, document.getElementById('app'))
}