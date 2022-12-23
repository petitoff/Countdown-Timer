# Countdown Timer
A mobile application that allows you to count down time. This is the so-called timer.

## Prev
![prev-1](https://github.com/petitoff/Countdown-Timer/blob/master/prev/prev-1.gif)

## Stack
- React Native
- Expo
- TypeScript

## Animation
``` ts
const animations = useCallback(() => {
  animateTextInput.setValue(duration);
  Animated.sequence([
    Animated.timing(animateButton, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(timerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.parallel([
      Animated.timing(animateTextInput, {
        toValue: 0,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: height,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.delay(4000),
    ]),
  ]).start(() => {
    Vibration.cancel();
    Vibration.vibrate();

    animateTextInput.setValue(duration);
    Animated.timing(animateButton, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });
}, [duration]);
```
