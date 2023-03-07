import { Dimensions, StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  blueCircle: {
    backgroundColor: 'blue',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    opacity: 0.8,
  },
});

export function AnimatedCircles({}) {

  const panGesture = Gesture.Pan();

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <View style={styles.container}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.blueCircle} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}
