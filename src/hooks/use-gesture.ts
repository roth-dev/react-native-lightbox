import { useRef } from "react";
import {
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
  Animated,
} from "react-native";

// -------------------------  default vars  ------------------------
const now = () => +new Date();
const { width, height } = Dimensions.get("window");
const INIT_POSITION = { x: 0, y: 0 };

// -------------------------  double tap props  -------------------------
interface IDoubleTapOptions {
  doubleTapZoomEnabled?: boolean;
  doubleTapGapTimer?: number;
  doubleTapCallback?: Function;
  doubleTapZoomToCenter?: boolean;
  doubleTapMaxZoom?: number;
  doubleTapZoomStep?: number;
  doubleTapInitialScale?: number;
  doubleTapAnimationDuration?: number;
  useNativeDriver?: boolean;
  UNSAFE_INNER_WIDTH__cropWidth?: number;
  UNSAFE_INNER_WIDTH__cropHeight?: number;
}

export interface AnimatedTransformStyle {
  transform: Partial<Record<"scale" | "translateX" | "translateY", Animated.Value>>[];
}

// -------------------------  all the gesture ability props  -------------------------
export interface IGestureProps extends IDoubleTapOptions { }
export interface GestureReturnFunction {
  reset: Function;
  onDoubleTap: Function;
}

// -------------------------  hooks  -------------------------
export const useGesture = ({
  doubleTapGapTimer = 300,
  doubleTapAnimationDuration = 100,
  doubleTapZoomEnabled = true,
  doubleTapCallback,
  doubleTapZoomToCenter,
  doubleTapMaxZoom = 2,
  doubleTapInitialScale = 1,
  doubleTapZoomStep = 0.5,
  UNSAFE_INNER_WIDTH__cropWidth = width,
  UNSAFE_INNER_WIDTH__cropHeight = height,
  useNativeDriver,
}: IGestureProps): [GestureReturnFunction, AnimatedTransformStyle | undefined] => {
  // last tap timer
  const lastTapTimer = useRef<number>(0);
  // if double taped
  const isDoubleTaped = useRef<boolean>(false);
  // double tap coordinates
  const coordinates = useRef<{ x: number; y: number }>(INIT_POSITION);
  // double tap scale
  const doubleTapScale = useRef<number>(doubleTapInitialScale);
  // animated
  const animatedScale = useRef<Animated.Value>(
    new Animated.Value(doubleTapInitialScale)
  );
  const animatedPositionX = useRef<Animated.Value>(
    new Animated.Value(INIT_POSITION.x)
  );
  const animatedPositionY = useRef<Animated.Value>(
    new Animated.Value(INIT_POSITION.y)
  );
  // animation style to export
  const animations = useRef<AnimatedTransformStyle>();

  // handle double-tap
  const onDoubleTap = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const nowTapTimer = now();
    if (gestureState.numberActiveTouches <= 1) {
      // double tap
      if (
        lastTapTimer.current &&
        (nowTapTimer - lastTapTimer.current) < doubleTapGapTimer
      ) {
        isDoubleTaped.current = true;
        lastTapTimer.current = 0;

        // double tap callback
        if (doubleTapCallback) doubleTapCallback(e, gestureState);

        // double tap zoom
        if (!doubleTapZoomEnabled) return;

        // next scale
        if (doubleTapScale.current >= doubleTapMaxZoom) {
          coordinates.current = INIT_POSITION;
          return (doubleTapScale.current = doubleTapInitialScale);
        }

        let nextScaleStep =
          doubleTapScale.current + doubleTapScale.current * doubleTapZoomStep;

        if (nextScaleStep >= doubleTapMaxZoom) {
          nextScaleStep = doubleTapMaxZoom;
        }

        doubleTapScale.current = nextScaleStep;

        coordinates.current = {
          x: e.nativeEvent.changedTouches[0].pageX,
          y: e.nativeEvent.changedTouches[0].pageY,
        };

        if (doubleTapZoomToCenter) {
          coordinates.current = {
            x: UNSAFE_INNER_WIDTH__cropWidth / 2,
            y: UNSAFE_INNER_WIDTH__cropHeight / 2,
          };
        }

        Animated.parallel([
          Animated.timing(animatedScale.current, {
            toValue: doubleTapScale.current,
            duration: doubleTapAnimationDuration,
            useNativeDriver,
          }),
          Animated.timing(animatedPositionX.current, {
            toValue:
              ((UNSAFE_INNER_WIDTH__cropWidth / 2 - coordinates.current.x) *
                (doubleTapScale.current - doubleTapInitialScale)) /
              doubleTapScale.current,
            duration: doubleTapAnimationDuration,
            useNativeDriver,
          }),
          Animated.timing(animatedPositionY.current, {
            toValue:
              ((UNSAFE_INNER_WIDTH__cropHeight / 2 - coordinates.current.y) *
                (doubleTapScale.current - doubleTapInitialScale)) /
              doubleTapScale.current,
            duration: doubleTapAnimationDuration,
            useNativeDriver,
          }),
        ]).start();

        animations.current = {
          transform: [
            {
              scale: animatedScale.current,
            },
            {
              translateX: animatedPositionX.current,
            },
            {
              translateY: animatedPositionY.current,
            },
          ],
        };
      } else {
        lastTapTimer.current = nowTapTimer;
      }
    }
  };

  // reset
  const reset = () => {
    // double tap animations reset
    animatedScale.current.setValue(doubleTapInitialScale);
    animatedPositionX.current.setValue(INIT_POSITION.x);
    animatedPositionY.current.setValue(INIT_POSITION.y);
  };

  // todo handle long press and press to save image

  // todo pinch to zoom

  return [
    {
      onDoubleTap,
      reset,
    },
    animations.current,
  ];
};
