import 'inferno-compat'
import { Component, render } from 'inferno'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'inferno-router'

import {
  Button,
  Nav,
  NavItem
} from 'inferno-bootstrap'

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

function Content ({ match }) {
  return (
    <div>
      <Switch>
        <Route path={`${match.path}/form`} component={ FormPage } />
        <Route path={`${match.path}/date`} component={ DatePage } />
        <Route path={`${match.path}/fileUpload`} component={ FileUploadPage } />
        <Route path={`${match.path}/fileUploadForm`} component={ ImageUploadFormPage } />
        <Route path={`${match.path}/listForm`} component={ ListFormPage } />
        <Redirect to="/compat/widgets/form" />
      </Switch>
    </div>
  )
}

class App extends Component {
  render () {
    return (
      <div className="Content">
        <Nav>
          <NavItem>
            <NavLink to="/compat/widgets/form">Example Form</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/compat/widgets/date">Date Picker</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/compat/widgets/fileUpload">File Upload</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/compat/widgets/fileUploadForm">Image Upload Form</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/compat/widgets/listForm">List Form</NavLink>
          </NavItem>
        </Nav>
        <Switch>
          <Route path="/compat/widgets" component={ Content } />
          <Redirect to="/compat/widgets/form" />
        </Switch>
      </div>
    )
  }
}

if (typeof window !== 'undefined') {
  render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('app'))
}