import { useRef, FC } from 'react'

export interface ILongPressToSaveProps {
  longPressTimer?: number
}

export const useLongPressToSave: FC<ILongPressToSaveProps> = ({ longPressTimer }) => {
  const isLongPress = useRef<boolean>(false);
  return null
}
