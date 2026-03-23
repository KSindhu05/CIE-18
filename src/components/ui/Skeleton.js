import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ 
    variant = 'text', 
    width, 
    height, 
    className = '', 
    style = {},
    glass = false
}) => {
    const skeletonClass = [
        styles.skeleton,
        styles[variant],
        glass ? styles.glass : '',
        className
    ].join(' ');

    const customStyle = {
        width: width || undefined,
        height: height || undefined,
        ...style
    };

    return (
        <div 
            className={skeletonClass} 
            style={customStyle}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
