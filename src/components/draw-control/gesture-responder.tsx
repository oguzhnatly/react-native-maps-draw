import React, { FC, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import type { TGestureControl, TTouchPoint } from '../../types';

const GestureHandler: FC<TGestureControl> = ({
  onEndTouchEvents,
  onStartTouchEvents,
  onChangeTouchEvents,
  allowMultiTouch = false,
}) => {
  const pathRef = useRef<TTouchPoint[]>([]);
  const isDrawing = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: (e, gestureState) => {
      if (allowMultiTouch || e.nativeEvent.touches.length === 1) {
        isDrawing.current = true;
        pathRef.current = [];
        onStartTouchEvents?.(e, gestureState);
      }
    },
    onPanResponderMove: (event) => {
      if (isDrawing.current && (allowMultiTouch || event.nativeEvent.touches.length === 1)) {
        pathRef.current.push({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        });
        onChangeTouchEvents?.([...pathRef.current]);
      }
    },
    onPanResponderRelease: () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        const points = [...pathRef.current];
        onChangeTouchEvents(points);
        onEndTouchEvents?.(points);
      }
    },
  });

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 10000,
      }}
      {...panResponder.panHandlers}
    />
  );
};

export default GestureHandler;
