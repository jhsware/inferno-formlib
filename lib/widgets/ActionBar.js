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
      this.scrollAnimationFrame = undefined
  }
  
  didScroll (e) {
      // Don't do this more than once per animation frame
      if (this.scrollAnimationFrame) { return }
      
      // Ok so we haven't done this since last frame... let's go
      this.scrollAnimationFrame = window.requestAnimationFrame(function() {
          // Don't do this if we can't find the element
          if (!this._flowingEl) {
              delete this.scrollAnimationFrame
              return
          }
      
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
          delete this.scrollAnimationFrame
      }.bind(this));
  }
  
  componentDidUpdate () {
      this.didScroll();
  }
  
  componentDidMount () {        
      window.addEventListener('scroll', this.didScroll)
      window.addEventListener('resize', this.didScroll)
      this.didScroll();   
  }
  
  componentWillUnmount () {
      window.removeEventListener('scroll', this.didScroll)
      window.removeEventListener('resize', this.didScroll)
  }
  
  render ({ boundary, children }) {
      return (
          <div className="InfernoFormlib-ActionBarContainer">
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