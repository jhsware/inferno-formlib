import Inferno from 'inferno'
import Component from 'inferno-component'
import { Router, Route, Redirect, IndexRoute, Link } from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'

import Button from 'inferno-bootstrap/lib/Button'

import Nav from 'inferno-bootstrap/lib/Navigation/Nav'
import NavItem from 'inferno-bootstrap/lib/Navigation/NavItem'

import FormPage from './FormPage'
import DatePage from './DatePage'
import FileUploadPage from './FileUploadPage'
import ImageUploadFormPage from './ImageUploadFormPage'
import ListFormPage from './ListFormPage'

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
            <NavLink to="/widgets/form">Example Form</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/widgets/date">Date Picker</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/widgets/fileUpload">File Upload</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/widgets/fileUploadForm">Image Upload Form</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/widgets/listForm">List Form</NavLink>
          </NavItem>
        </Nav>
        {this.props.children}
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  // require('inferno-devtools')
  const browserHistory = createBrowserHistory()

  const appRoutes = (
    <Router history={ browserHistory }>
      <Route path="/widgets" component={ AppLayout }>
        <Route path="/form" component={ FormPage } />
        <Route path="/date" component={ DatePage } />
        <Route path="/fileUpload" component={ FileUploadPage } />
        <Route path="/fileUploadForm" component={ ImageUploadFormPage } />
        <Route path="/listForm" component={ ListFormPage } />
      </Route>
      <Redirect from="/*" to="/widgets/form" />
    </Router>
  )
  Inferno.render(appRoutes, document.getElementById('app'))
}