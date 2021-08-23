import { Animated } from "react-native";
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
export interface IGestureProps extends IDoubleTapOptions {
}
export interface GestureReturnFunction {
    reset: Function;
    onDoubleTap: Function;
}
export declare const useGesture: ({ doubleTapGapTimer, doubleTapAnimationDuration, doubleTapZoomEnabled, doubleTapCallback, doubleTapZoomToCenter, doubleTapMaxZoom, doubleTapInitialScale, doubleTapZoomStep, UNSAFE_INNER_WIDTH__cropWidth, UNSAFE_INNER_WIDTH__cropHeight, useNativeDriver, }: IGestureProps) => [GestureReturnFunction, AnimatedTransformStyle | undefined];
export {};
