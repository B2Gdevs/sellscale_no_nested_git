import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './27566-stock-market-analysis.json'
 
export default class LottieControl extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() {
 
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 
    return <div>
      <Lottie options={defaultOptions}
              height={300}
              width="45%"
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
    </div>
  }
}
 