import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    filled?: boolean;
}

export const LockIcon = ({ size = 24, color = '#000', filled = false }: IconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {filled ? (
                <>
                    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={color} />
                    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </>
            ) : (
                <>
                    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={2} />
                    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} />
                </>
            )}
        </Svg>
    );
};
