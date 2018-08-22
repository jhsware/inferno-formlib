'use strict';
import { Component } from 'inferno'
import { getElOffset } from './utils'
import classnames from 'classnames'

const _getElOffset = getElOffset

export class ActionBar extends Component {
  // TODO: Make this sticky AF
  constructor (props) {
      super(...arguments)
      
      this.state = {
          isSticky: false,
          stickyWidth: undefined
      }

      this.didScroll = this.didScroll.bind(this)
      this.pollForMovementTimer = undefined
      this.offsetFlowNode = undefined

      this.pollForMovement = this.pollForMovement.bind(this)
  }
  
  didScroll (e) {
    const newState = {}
    
    const flowNode = this._flowingEl
    // var isSticky = _getElOffset(flowNode).top < (window.scrollY + this.props.boundary.top) && window.scrollY < this.props.boundary.bottom
    const isSticky = _getElOffset(flowNode).top + flowNode.offsetHeight > (window.visualViewport.height + window.scrollY) && (this.props.boundary.top < window.innerHeight + window.scrollY)
    if (isSticky !== this.state.isSticky) {
        newState['isSticky'] = isSticky
    }

    const stickyWidth = flowNode.offsetWidth
    if (stickyWidth !== this.state.stickyWidth) {
        newState['stickyWidth'] = stickyWidth
    }

    if (Object.keys(newState).length > 0) {
        this.setState(newState)
    }
  }

  pollForMovement () {
    if (!this._flowingEl) {
        return this.pollForMovementTimer = requestAnimationFrame(this.pollForMovement)
    }

    const flowNode = this._flowingEl
    const offset = flowNode.offsetTop - (window.scrollY !== undefined ? window.scrollY : window.pageYOffset)
    if (this.offsetFlowNode !== offset) {
        this.offsetFlowNode = offset
        this.didScroll()
    }
    this.pollForMovementTimer = requestAnimationFrame(this.pollForMovement)
  }
  
  componentDidMount () {
      this.pollForMovementTimer = requestAnimationFrame(this.pollForMovement)
      this.didScroll()
  }
  
  componentWillUnmount () {
      if (this.pollForMovementTimer) {
        cancelAnimationFrame(this.pollForMovementTimer)
      }
  }
  
  render ({ boundary, children }) {
      return (
          <div className={classnames("InfernoFormlib-ActionBarContainer", this.props.className)}>
              <div ref={(e) => this._flowingEl = e} className={classnames("InfernoFormlib-ActionBar", {"InfernoFormlib-ActionBar--hidden": this.state.isSticky} )}>
                  {children}
              </div>
              <div className={classnames("InfernoFormlib-ActionBar InfernoFormlib-StickyActionBar", {"InfernoFormlib-StickyActionBar--hidden": !this.state.isSticky})}
                  style={{ bottom: boundary.bottom, width: this.state.stickyWidth }}>
                  {children}
              </div>
              
          </div>
      )
  }
}