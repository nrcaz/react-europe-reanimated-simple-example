import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

const { Value, Clock, event, add, block, cond, eq, set, spring, startClock, neq, stopClock, clockRunning, debug } = Animated

const springConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
  toValue: 0
};

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.transX = new Value(0)
    this.offsetX = new Value(0)
    this.gestureState = new Value(State.UNDETERMINED)
    this.clock = new Clock()

    this.springState = {
      position: this.transX,
      velocity: new Value(0),
      time: new Value(0),
      finished: new Value(0)
    }

    // {
    //   if (this.gestureState === State.END) {
    //     this.offsetX = this.transX + this.offsetX;
    //     this.transX = 0;
    //   }
    //   return this.transX + this.offsetX;
    // }

    this.animX = block([
      cond(eq(this.gestureState, State.END),[
        // set(this.offsetX, add(this.transX, this.offsetX)),
        // set(this.transX, 0)
        startClock(this.clock)
      ]),
      cond(clockRunning(this.clock), [
        spring(this.clock, this.springState, springConfig),
      ]),
      cond(eq(this.springState.finished, 1), [
        stopClock(this.clock),
        set(this.springState.time, 0),
        set(this.springState.velocity, 0),
        set(this.springState.finished, 0)        
      ]),
      // add(this.transX, this.offsetX)
      this.transX
    ])

    this.handlePan = event([
      {
        nativeEvent: {
          translationX: this.transX,
          state: this.gestureState
        }
      }
    ])
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler 
          onGestureEvent={this.handlePan} 
          onHandlerStateChange={this.handlePan}
        >
        <Animated.View style={[styles.box, {
          transform: [{ translateX : this.animX }]
        }]} 
        />
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue'
  }
});
