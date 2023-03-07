import { Dimensions, StyleSheet, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
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

type AnimatedTranslation = {
  x: SharedValue<number>,
  y: SharedValue<number>,
};

const useDelayAnimatedTranslation = ({ x, y }: AnimatedTranslation) => {
  const delayedTranslateX = useDerivedValue(() => {
    return withSpring(x.value, {
      damping: 20,
      stiffness: 200,
    });
  });
  const delayedTranslateY = useDerivedValue(() => {
    return withSpring(y.value, {
      damping: 20,
      stiffness: 200,
    });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: delayedTranslateX.value },
        { translateY: delayedTranslateY.value },
      ],
    };
  });

  return { delayedTranslateX, delayedTranslateY, animatedStyle };
};

export function AnimatedCircles({}) {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })

  const { animatedStyle: blueAnimatedStyle } = useDelayAnimatedTranslation({ x: translateX, y: translateY });

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <View style={styles.container}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.blueCircle,
              blueAnimatedStyle,
            ]}
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}
