import * as React from "react";
import {
  Vibration,
  StatusBar,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("window");
const colors = {
  black: "#323F4E",
  red: "#F76A6A",
  text: "#ffffff",
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

export default function App() {
  const xScroll = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef<any>();

  const [duration, setDuration] = React.useState(timers[0]);
  const timerAnimation = React.useRef(new Animated.Value(height)).current;
  const animateButton = React.useRef(new Animated.Value(0)).current;
  const animateTextInput = React.useRef(new Animated.Value(timers[0])).current;

  React.useEffect(() => {
    const listner = animateTextInput.addListener(({ value }) => {
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString(),
      });
    });
    return () => {
      animateTextInput.removeListener(listner);
      animateTextInput.removeAllListeners();
    };
  });

  const animations = React.useCallback(() => {
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

  const opacity = animateButton.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const translateY = animateButton.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const textOpacity = animateButton.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height,
            width,
            backgroundColor: colors.red,
            transform: [
              {
                translateY: timerAnimation,
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={animations}>
          <View style={styles.roundButton} />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: ITEM_SIZE,
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            opacity: textOpacity,
          }}
        >
          <TextInput
            ref={inputRef}
            style={styles.text}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          keyExtractor={(item) => item.toString()}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / ITEM_SIZE
            );
            setDuration(timers[index]);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: xScroll } } }],
            { useNativeDriver: true }
          )}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          style={{ flexGrow: 0, opacity }}
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];

            const opacity = xScroll.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
            });

            const scale = xScroll.interpolate({
              inputRange,
              outputRange: [0.6, 1, 0.6],
            });
            return (
              <View
                style={{
                  width: ITEM_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    {
                      opacity,
                      transform: [
                        {
                          scale,
                        },
                      ],
                    },
                  ]}
                >
                  {item}
                </Animated.Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: ITEM_SIZE * 0.8,
    color: colors.text,
    fontWeight: "800",
  },
});
