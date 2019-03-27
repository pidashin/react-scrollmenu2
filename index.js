import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { withGesture } from 'react-with-gesture'

const unit = 100
const preserveCount = 6

const genLoopSource = (arr, start = 0) => {  
  let source = arr.concat(arr, arr), count = 1

  while((count * arr.length) < preserveCount){
    source = source.concat(arr, arr)
    count++
  }

  const middle = start + count * arr.length  
  source = source.slice(middle - preserveCount, middle + preserveCount + 1)

  return source
}

@withGesture
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: preserveCount,
      tmpActive: 0,
      items: genLoopSource(props.items),
    };

    this.fixloop = this.fixloop.bind(this)
  }

  timeout = null

  componentWillReceiveProps(nextProps){
    const {xDelta, down} = nextProps
    const {active, tmpActive} = this.state

    let transition = 'none'
    if(down && !this.props.down)
      clearTimeout(this.timeout)

    const absDelta = Math.abs(xDelta), sign = xDelta > 0 ? -1 : 1

    let newTmp = active + Math.floor(absDelta/(unit * 0.6)) * (xDelta > 0 ? -1 : 1)

    let newActive = active
    if(this.props.down && !down){
      newActive = newTmp
      newTmp = 0

      this.timeout = setTimeout(() => {
        this.fixloop()
      }, 300)

      transition = '300ms'
    }     

    this.setState({
      active: newActive,
      tmpActive: newTmp,
      transition,
    })
  }

  fixloop(){
    const {items} = this.props, {active, items: source} = this.state
    const activeIdx = items.indexOf(source[active])

    this.setState({
      active: preserveCount,
      tmpActive: 0,
      items: genLoopSource(this.props.items, activeIdx),
      transition: 'none'
    })
  }

  render() {
    const { xInitial, xDelta, down} = this.props

    const {active, tmpActive, items, transition} = this.state

    const unit1 = unit * 0.6 + 10, firstmove = -50

    const move = (active - 2) * unit1 * -1 + firstmove + (down ? xDelta : 0)

    return (
      <div>
        <div className="container">
          <div className="wrapper" style={{transform: `translateX(${move}px)`, transition}}>
            {
              items.map((x, idx) => {
                const base = down ? tmpActive : active, diff = Math.abs(idx - base)
                const additionClass = diff === 0 ? 'xxl' : (diff === 1 ? 'xl' : '')

                return (
                  <div key={idx} 
                    style={{transition: down ? '300ms' : 'none' }}
                    className={`item bg-${x} ${additionClass}`}>{x}</div>
                )
              })
            }
          </div>
        </div>
        <p>{`active: ${active}`}</p>
        <p>{`xDelta: ${xDelta}`}</p>
        <p>{`tmpActive: ${tmpActive}`}</p>
        <p>{`move: ${move}`}</p>
      </div>
    );
  }
}

render(<App items={[1,2,3,4,5,6,7,8,9]} />, document.getElementById('root'));
