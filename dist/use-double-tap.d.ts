import { Animated } from 'react-native';
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
export declare type DoubleTapOptions = Omit<IDoubleTapOptions, 'UNSAFE_INNER_WIDTH__cropWidth' | 'UNSAFE_INNER_WIDTH__cropHeight'>;
export declare const useDoubleTap: ({ doubleTapGapTimer, doubleTapAnimationDuration, doubleTapEnabled, doubleTapCallback, doubleTapZoomToCenter, doubleTapMaxZoom, doubleTapInitialScale, doubleTapZoomStep, UNSAFE_INNER_WIDTH__cropWidth, UNSAFE_INNER_WIDTH__cropHeight, useNativeDriver }?: IDoubleTapOptions) => [Function, Function];
export {};
