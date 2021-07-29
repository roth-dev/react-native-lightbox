import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from 'react-native';

import { LightboxOverlayProps } from "./LightboxOverlay";

export interface LightboxProps<T = any> extends LightboxOverlayProps {
  activeProps?: Record<string, T>;
}

const Lightbox: React.FC<LightboxProps> = () => {
  const layoutOpacity = useRef(new Animated.Value(1));
  const _root = useRef(null);

  const [visible, setToVisible] = useState(false);
  const [origin, setOrigin] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  
  return null;
};

export default Lightbox;
