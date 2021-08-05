import React, {
  useRef,
  cloneElement,
  Children,
  isValidElement,
  useEffect,
} from "react";
import {
  StyleProp,
  ViewStyle,
  Animated,
  TouchableHighlight,
  View,
  ModalProps,
} from "react-native";

import LightboxOverlay from "./LightboxOverlay";
import { useAsyncSetState } from "./use-async-state";

const noop = () => {};

export type Func<T, R> = (...args: T[]) => R;

export interface IOrigin {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ISpringConfig {
  tension: number;
  friction: number;
}

export interface LightboxProps<T = any> {
  activeProps?: Record<string, T>;
  renderContent?: Func<T, JSX.Element>;
  renderHeader?: Func<T, JSX.Element>;
  didOpen?: Func<T, void>;
  onOpen?: Func<T, void>;
  // willOpen?: Func<T, void>;
  willClose?: Func<T, void>;
  onClose?: Func<T, void>;
  // didClose?: Func<T, void>;
  onLongPress?: Func<T, void>;
  onLayout?: Func<T, void>;
  swipeToDismiss?: boolean;
  disabled?: boolean;
  springConfig?: ISpringConfig;
  style?: StyleProp<ViewStyle>;
  underlayColor?: string;
  backgroundColor?: string;
  useNativeDriver?: boolean;
  dragDismissThreshold?: number;
  modalProps?: ModalProps;
}

const Lightbox: React.FC<LightboxProps> = ({
  activeProps,
  swipeToDismiss = true,
  useNativeDriver = false,
  disabled = false,
  renderContent,
  renderHeader,
  // willOpen = noop,
  didOpen = noop,
  onOpen = noop,
  willClose = noop,
  onClose = noop,
  // didClose = noop,
  onLongPress = noop,
  onLayout = noop,
  springConfig = { tension: 30, friction: 7 },
  backgroundColor = "blank",
  underlayColor,
  style,
  dragDismissThreshold = 150,
  children,
  modalProps = {},
}) => {
  const layoutOpacity = useRef(new Animated.Value(1));
  const _root = useRef<View>(null);
  const timer = useRef<number | null>(null);

  const [{ isOpen, origin }, setStateAsync] = useAsyncSetState({
    isOpen: false,
    origin: { x: 0, y: 0, width: 0, height: 0 },
  });

  const getContent = () => {
    if (renderContent) return renderContent();
    else if (activeProps && isValidElement(children))
      return cloneElement(Children.only(children), activeProps);

    return children;
  };

  const handleOnClose = async () => {
    layoutOpacity.current.setValue(1);
    await setStateAsync((s) => ({ ...s, isOpen: false }));
    onClose();
  };

  const wrapMeasureWithPromise = (): Promise<IOrigin> =>
    new Promise((resolve) => {
      _root.current!.measure((ox, oy, width, height, px, py) => {
        resolve({ width, height, x: px, y: py });
      });
    });

  const open = async () => {
    if (!_root.current) return;

    onOpen();

    const newOrigin = await wrapMeasureWithPromise();
    await setStateAsync((s) => ({
      ...s,
      isOpen: true,
      origin: { ...newOrigin },
    }));

    timer.current = setTimeout(() => {
      _root.current && layoutOpacity.current.setValue(0);
    });
  };

  // will unmount
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const getOverlayProps = () => ({
    isOpen,
    origin,
    renderHeader,
    swipeToDismiss,
    springConfig,
    backgroundColor,
    children: getContent(),
    didOpen,
    willClose,
    onClose: handleOnClose,
    useNativeDriver,
    dragDismissThreshold,
    modalProps,
  });

  return (
    <View ref={_root} style={style} onLayout={onLayout}>
      <Animated.View style={{ opacity: layoutOpacity.current }}>
        <TouchableHighlight
          underlayColor={underlayColor}
          onPress={open}
          onLongPress={onLongPress}
          disabled={disabled}
        >
          {children}
        </TouchableHighlight>
      </Animated.View>
      {disabled ? null : <LightboxOverlay {...getOverlayProps()} />}
    </View>
  );
};

export default Lightbox;
