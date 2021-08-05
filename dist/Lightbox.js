import React, { useRef, cloneElement, Children, isValidElement, useEffect, } from "react";
import { Animated, TouchableHighlight, View, } from "react-native";
import LightboxOverlay from "./LightboxOverlay";
import { useAsyncSetState } from "./use-async-state";
const noop = () => { };
const Lightbox = ({ activeProps, swipeToDismiss = true, useNativeDriver = false, disabled = false, renderContent, renderHeader, 
// willOpen = noop,
didOpen = noop, onOpen = noop, willClose = noop, onClose = noop, 
// didClose = noop,
onLongPress = noop, onLayout = noop, springConfig = { tension: 30, friction: 7 }, backgroundColor = "blank", underlayColor, style, dragDismissThreshold = 150, children, modalProps = {}, }) => {
    const layoutOpacity = useRef(new Animated.Value(1));
    const _root = useRef(null);
    const timer = useRef(null);
    const [{ isOpen, origin }, setStateAsync] = useAsyncSetState({
        isOpen: false,
        origin: { x: 0, y: 0, width: 0, height: 0 },
    });
    const getContent = () => {
        if (renderContent)
            return renderContent();
        else if (activeProps && isValidElement(children))
            return cloneElement(Children.only(children), activeProps);
        return children;
    };
    const handleOnClose = async () => {
        layoutOpacity.current.setValue(1);
        await setStateAsync((s) => ({ ...s, isOpen: false }));
        onClose();
    };
    const wrapMeasureWithPromise = () => new Promise((resolve) => {
        _root.current.measure((ox, oy, width, height, px, py) => {
            resolve({ width, height, x: px, y: py });
        });
    });
    const open = async () => {
        if (!_root.current)
            return;
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
    return (<View ref={_root} style={style} onLayout={onLayout}>
      <Animated.View style={{ opacity: layoutOpacity.current }}>
        <TouchableHighlight underlayColor={underlayColor} onPress={open} onLongPress={onLongPress} disabled={disabled}>
          {children}
        </TouchableHighlight>
      </Animated.View>
      {disabled ? null : <LightboxOverlay {...getOverlayProps()}/>}
    </View>);
};
export default Lightbox;
