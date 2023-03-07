import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: 'blue',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    opacity: 0.8,
    position: 'absolute',
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
    .onEnd(() => {
      // Horisontal and vertical dampening from the screen edges, to prevent "losing" our circles beyond the screen edge.
      if (translateX.value > (SCREEN_WIDTH / 2 - CIRCLE_SIZE / 4)) {
        translateX.value = SCREEN_WIDTH / 2 - CIRCLE_SIZE;
      } else if (translateX.value < -(SCREEN_WIDTH / 2 - CIRCLE_SIZE / 4)) {
        translateX.value = -(SCREEN_WIDTH / 2 - CIRCLE_SIZE);
      }

      if (translateY.value > (SCREEN_HEIGHT / 2 - CIRCLE_SIZE / 4)) {
        translateY.value = SCREEN_HEIGHT / 2 - CIRCLE_SIZE;
      } else if (translateY.value < -(SCREEN_HEIGHT / 2 - CIRCLE_SIZE / 4)) {
        translateY.value = -(SCREEN_HEIGHT / 2 - CIRCLE_SIZE);
      }
    });

  const {
    animatedStyle: blueAnimatedStyle,
    delayedTranslateX: blueTranslateX,
    delayedTranslateY: blueTranslateY,
  } = useDelayAnimatedTranslation({ x: translateX, y: translateY });
  const {
    animatedStyle: redAnimatedStyle,
    delayedTranslateX: redTranslateX,
    delayedTranslateY: redTranslateY,
  } = useDelayAnimatedTranslation({ x: blueTranslateX, y: blueTranslateY });
  const { animatedStyle: greenAnimatedStyle } = useDelayAnimatedTranslation({ x: redTranslateX, y: redTranslateY });

  const BlueCircle = () => {
    return (
      <Animated.View
        style={[
          styles.circle,
          blueAnimatedStyle,
        ]}
      />
    );
  };
  const RedCircle = () => {
    return (
      <Animated.View
        style={[
          styles.circle,
          redAnimatedStyle,
          { backgroundColor: 'red' },
        ]}
      />
    );
  };
  const GreenCircle = () => {
    return (
      <Animated.View
        style={[
          styles.circle,
          greenAnimatedStyle,
          { backgroundColor: 'green' },
        ]}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <SafeAreaView style={styles.container}>
        <GreenCircle />
        <RedCircle />
        <GestureDetector gesture={panGesture}>
          <BlueCircle />
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
