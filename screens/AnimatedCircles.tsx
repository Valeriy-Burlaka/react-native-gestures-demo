import { Dimensions, StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
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
    alignItems: 'center',
    justifyContent: 'center',
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

  const originalPosition = useSharedValue({ x: 0, y: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      originalPosition.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + originalPosition.value.x;
      translateY.value = event.translationY + originalPosition.value.y;
    })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <View style={styles.container}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.blueCircle,
              animatedStyles,
            ]}
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}
