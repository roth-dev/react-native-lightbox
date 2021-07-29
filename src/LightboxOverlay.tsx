import React, { useState } from "react";
import { Animated, Dimensions, Platform, StyleSheet } from "react-native";

export interface LightboxOverlayProps {
  useNativeDriver?: boolean;
  dragDismissThreshold?: number;
  navigator?: string;
}

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const isIos = Platform.OS === "ios";

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  open: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    // Android pan handlers crash without this declaration:
    backgroundColor: "transparent",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    backgroundColor: "transparent",
  },
  closeButton: {
    fontSize: 35,
    color: "white",
    lineHeight: 60,
    width: 70,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: "black",
    shadowOpacity: 0.8,
  },
});

const LightboxOverlay: React.FC<LightboxOverlayProps> = ({
  useNativeDriver,
  dragDismissThreshold = 150,
  navigator,
}) => {
  return null;
};

export default LightboxOverlay;
