import { useRef } from 'react';
import { Dimensions, Animated } from 'react-native';
const now = () => +new Date();
const { width, height } = Dimensions.get('window');
const INIT_POSITION = { x: 0, y: 0 };
export const useDoubleTap = ({ doubleTapGapTimer = 300, doubleTapAnimationDuration = 100, doubleTapEnabled = true, doubleTapCallback, doubleTapZoomToCenter, doubleTapMaxZoom = 2, doubleTapInitialScale = 1, doubleTapZoomStep = 0.5, UNSAFE_INNER_WIDTH__cropWidth = width, UNSAFE_INNER_WIDTH__cropHeight = height, useNativeDriver } = {}) => {
    const lastTapTimer = useRef(0);
    const coordinates = useRef(INIT_POSITION);
    const scale = useRef(doubleTapInitialScale);
    const animatedScale = useRef(new Animated.Value(doubleTapInitialScale));
    const animatedPositionX = useRef(new Animated.Value(INIT_POSITION.x));
    const animatedPositionY = useRef(new Animated.Value(INIT_POSITION.y));
    // todo export double-taped status.
    const doubleTaped = useRef(false);
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
    const setAnimation = (ref) => {
        if (!ref)
            return;
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
        };
    };
    // todo how to reset can be better?
    const reset = (ref) => {
        animatedScale.current.setValue(doubleTapInitialScale);
        animatedPositionX.current.setValue(INIT_POSITION.x);
        animatedPositionY.current.setValue(INIT_POSITION.y);
        setAnimation(ref);
    };
    const handleDoubleTap = (e, gestureState, ref) => {
        if (doubleTapCallback)
            doubleTapCallback(e, gestureState);
        handleNextScaleStep();
        coordinates.current = {
            x: e.nativeEvent.changedTouches[0].pageX,
            y: e.nativeEvent.changedTouches[0].pageY
        };
        if (doubleTapZoomToCenter) {
            coordinates.current = INIT_POSITION;
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
    };
    const onDoubleTap = (e, gestureState, ref) => {
        const nowTapTimer = now();
        if (lastTapTimer.current && (nowTapTimer - lastTapTimer.current) < doubleTapGapTimer) {
            lastTapTimer.current = 0;
            if (doubleTapEnabled && gestureState.numberActiveTouches <= 1) {
                doubleTaped.current = true;
                handleDoubleTap(e, gestureState, ref);
            }
            ;
        }
        else {
            lastTapTimer.current = nowTapTimer;
        }
    };
    return [
        onDoubleTap,
        reset
    ];
};
