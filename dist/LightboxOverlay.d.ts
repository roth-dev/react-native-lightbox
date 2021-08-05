import React from "react";
import { LightboxProps, IOrigin, ISpringConfig } from "./Lightbox";
declare type OmitedLightboxProps = Omit<LightboxProps, "style" | "disabled" | "underlayColor" | "activeProps" | "renderContent">;
export interface LightboxOverlayProps extends OmitedLightboxProps {
    isOpen?: boolean;
    origin?: IOrigin;
    springConfig?: ISpringConfig;
}
declare const LightboxOverlay: React.FC<LightboxOverlayProps>;
export default LightboxOverlay;
