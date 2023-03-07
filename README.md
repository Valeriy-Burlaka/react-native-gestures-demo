# React Native Gestures Demo

Getting used to `react-native-gesture-handler` v2 API.

## Start

This project was bootstrapped with Expo SDK v48. To start it locally, run:

```shell
yarn && yarn start
```

## Key Takeaways

1. Multiple animated styles cannot be merged via the `style` prop (unlike the static styles). For example, this won't work:

    ```JSX

    const styles = StyleSheet.create({
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
    });

    const Circle = () => {
      const animatedStyle__one = useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: translateX.value },
          ],
        };
      });
      const animatedStyle__two = useAnimatedStyle(() => {
        return {
          transform: [
            { scale: scale.value },
          ],
        };
      });

      return (
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: 'blue' }, // Static styles get merged
            animatedStyle__one,
            animatedStyle__two,  // Animated styles - don't
          ]}
        />
      );
    };
    ```

    so you need to initialize them in one go:

    ```JSX
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { scale: scale.value },
        ],
      };
    });
    ```

    This may actually [be a bug](https://github.com/software-mansion/react-native-reanimated/issues/3209) introduced in reanimated v2.4.1.

2. The same animated style can't be assigned to multiple animated elements. So, for example, the following will not work:

    ```JSX

    function Screen() {
      const animatedStyles = useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: translateX.value },
            { scale: scale.value },
          ],
        };
      });
      
      return (
        <SafeAreaView>
          <Animated.View
            style={animatedStyles}
          />
          {/** This won't work, - you have to initialise another instance of animated styles  */}
          <Animated.View
            style={animatedStyles}
          />
        </SafeAreaView>
      );
    }
    ```

See a related discussion [here](https://github.com/software-mansion/react-native-reanimated/issues/1363).
