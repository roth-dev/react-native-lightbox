import React, {
  useRef,
  useState,
  cloneElement,
  Children,
  isValidElement,
} from "react";
import {
  StyleProp,
  ViewStyle,
  Animated,
  TouchableOpacity,
  View,
} from "react-native";

import { LightboxOverlayProps } from "./LightboxOverlay";

export const noop = () => {};

export interface LightboxProps<T = any> extends LightboxOverlayProps {
  activeProps?: Record<string, T>;
  renderContent?: (...args: T[]) => JSX.Element;
  renderHeader?: (...args: T[]) => JSX.Element;
  swipeToDismiss?: boolean;
  springConfig?: { tension: number; friction: number };
  backgroundColor?: string;
  didOpen?: (...args: T[]) => void;
  onOpen?: (...args: T[]) => void;
  willClose?: (...args: T[]) => void;
  onClose?: (...args: T[]) => void;
  onLongPress?: (...args: T[]) => void;
  onLayout?: (...args: T[]) => void;
  useNativeDriver?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Lightbox: React.FC<LightboxProps> = ({
  activeProps,
  swipeToDismiss = true,
  useNativeDriver = false,
  renderContent,
  renderHeader,
  didOpen = noop,
  onOpen = noop,
  willClose = noop,
  onClose = noop,
  onLongPress = noop,
  onLayout = noop,
  springConfig,
  backgroundColor,
  style,
  children,
}) => {
  const layoutOpacity = useRef(new Animated.Value(1));
  const _root = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [visible, setToVisible] = useState(false);
  const [origin, setOrigin] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const getContent = () => {
    if (renderContent) return renderContent();
    else if (activeProps && isValidElement(children))
      return cloneElement(Children.only(children), activeProps);

    return children;
  };

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
    onClose,
    useNativeDriver,
  });

  return (
    <View ref={_root} style={style} onLayout={onLayout}>
      <Animated.View></Animated.View>
    </View>
  );
};

export default Lightbox;
