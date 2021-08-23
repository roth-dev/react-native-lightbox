import { useRef } from 'react';
import { GestureResponderEvent, PanResponderGestureState, Dimensions, Animated } from 'react-native';

const now = () => +new Date();
const { width, height } = Dimensions.get('window');
const INIT_POSITION = { x: 0, y: 0 };

interface IDoubleTapOptions {
  doubleTapEnabled?: boolean;
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
  transform: Partial<Record<'scale' | 'translateX' | 'translateY', Animated.Value>>[];
}
type AnimatedTransformStyleRef = React.MutableRefObject<AnimatedTransformStyle | undefined>

export type DoubleTapOptions = Omit<IDoubleTapOptions, 'UNSAFE_INNER_WIDTH__cropWidth' | 'UNSAFE_INNER_WIDTH__cropHeight'>;

export const useDoubleTap = ({
  doubleTapGapTimer = 300,
  doubleTapAnimationDuration = 100,
  doubleTapEnabled = true,
  doubleTapCallback,
  doubleTapZoomToCenter,
  doubleTapMaxZoom = 2,
  doubleTapInitialScale = 1,
  doubleTapZoomStep = 0.5,
  UNSAFE_INNER_WIDTH__cropWidth = width,
  UNSAFE_INNER_WIDTH__cropHeight = height,
  useNativeDriver
}: IDoubleTapOptions = {}): [Function, Function, boolean] => {
  const lastTapTimer = useRef<number>(0);
  const coordinates = useRef<{ x: number; y: number }>(INIT_POSITION);
  const scale = useRef<number>(doubleTapInitialScale);

  const animatedScale = useRef<Animated.Value>(new Animated.Value(doubleTapInitialScale));
  const animatedPositionX = useRef<Animated.Value>(new Animated.Value(INIT_POSITION.x));
  const animatedPositionY = useRef<Animated.Value>(new Animated.Value(INIT_POSITION.y));

  // todo export double-taped status.
  const doubleTaped = useRef<boolean>(false);

  const handleNextScaleStep = () => {
    if (scale.current >= doubleTapMaxZoom) {
      coordinates.current = INIT_POSITION;
      return (scale.current = doubleTapInitialScale);
    }

    let nextScaleStep = scale.current + scale.current * doubleTapZoomStep;

    if (nextScaleStep >= doubleTapMaxZoom) {
      nextScaleStep = doubleTapMaxZoom;
    }

    scale.current = nextScaleStep;
  };

  const setAnimation = (ref: AnimatedTransformStyleRef) => {
    if (!ref) return;
    ref.current = {
      transform: [
        {
          scale: animatedScale.current
        },
        {
          translateX: animatedPositionX.current,
        },
        {
          translateY: animatedPositionY.current,
        }
      ]
    }
  }

  // todo how to reset can be better?
  const reset = (ref: AnimatedTransformStyleRef) => {
    animatedScale.current.setValue(doubleTapInitialScale);
    animatedPositionX.current.setValue(INIT_POSITION.x);
    animatedPositionY.current.setValue(INIT_POSITION.y);
    setAnimation(ref);
  }

  const handleDoubleTap = (e: GestureResponderEvent, gestureState: PanResponderGestureState, ref: AnimatedTransformStyleRef) => {
    if (doubleTapCallback) doubleTapCallback(e, gestureState);

    handleNextScaleStep();

    coordinates.current = {
      x: e.nativeEvent.changedTouches[0].pageX,
      y: e.nativeEvent.changedTouches[0].pageY
    }

    if (doubleTapZoomToCenter) {
      coordinates.current = {
        x: UNSAFE_INNER_WIDTH__cropWidth / 2,
        y: UNSAFE_INNER_WIDTH__cropHeight / 2
      };
    }

    Animated.parallel([
      Animated.timing(animatedScale.current, {
        toValue: scale.current,
        duration: doubleTapAnimationDuration,
        useNativeDriver,
      }),
      Animated.timing(animatedPositionX.current, {
        toValue: ((UNSAFE_INNER_WIDTH__cropWidth / 2 - coordinates.current.x) * (scale.current - doubleTapInitialScale)) / scale.current,
        duration: doubleTapAnimationDuration,
        useNativeDriver,
      }),
      Animated.timing(animatedPositionY.current, {
        toValue: ((UNSAFE_INNER_WIDTH__cropHeight / 2 - coordinates.current.y) * (scale.current - doubleTapInitialScale)) / scale.current,
        duration: doubleTapAnimationDuration,
        useNativeDriver,
      }),
    ]).start();

    // todo it's not better enough.
    setAnimation(ref);
  }

  const onDoubleTap = (e: GestureResponderEvent, gestureState: PanResponderGestureState, ref: AnimatedTransformStyleRef) => {
    const nowTapTimer = now();
    if (lastTapTimer.current && (nowTapTimer - lastTapTimer.current) < doubleTapGapTimer) {
      lastTapTimer.current = 0;
      if (doubleTapEnabled && gestureState.numberActiveTouches <= 1) {
        doubleTaped.current = true;
        handleDoubleTap(e, gestureState, ref);
      };
    }
    else {
      lastTapTimer.current = nowTapTimer;
    }
  }

  return [
    onDoubleTap,
    reset,
    doubleTaped.current
  ]
}
