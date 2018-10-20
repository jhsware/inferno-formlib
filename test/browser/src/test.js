/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import { Component, render } from 'inferno'

import classNames from 'classnames'

import {
  Button,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'inferno-bootstrap'

// Placeholder
import { Manager, Target, Arrow } from 'inferno-popper'

class Widget extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <Manager>
        <Target>
          <Button id="Popover1" onClick={this.toggle}>
            Launch Popover
          </Button>
        </Target>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>Popover Title</PopoverHeader>
          <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
        </Popover>
      </Manager>
    );
  }
}


if (typeof window !== 'undefined') {
  // require('inferno-devtools')

  render(<Widget />, document.getElementById('app'))
}
