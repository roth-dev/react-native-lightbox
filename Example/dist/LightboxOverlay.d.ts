import React from "react";
import { LightboxProps, IOrigin, ISpringConfig } from "./Lightbox";
import { DoubleTapOptions } from "./use-double-tap";
declare type OmitedLightboxProps = Omit<LightboxProps, "style" | "disabled" | "underlayColor" | "activeProps" | "renderContent">;
export interface LightboxOverlayProps extends OmitedLightboxProps, DoubleTapOptions {
    isOpen?: boolean;
    origin?: IOrigin;
    springConfig?: ISpringConfig;
}
declare const LightboxOverlay: React.FC<LightboxOverlayProps>;
export default LightboxOverlay;
