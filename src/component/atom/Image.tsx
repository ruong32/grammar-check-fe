import React from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { cx } from '@/helper'

type ImageProps = Omit<NextImageProps, 'fill' | 'height' | 'width'> & {
	objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

export default function Image({
	className,
	src,
	objectFit = 'cover',
	...props
}: ImageProps) {
	const getSrc = () => {
		if (!src?.toString().match(/^(\/|http(s)?:\/\/)/)) {
			return ''
		}
		return src
	}
	return (
		<div className={cx('relative overflow-hidden', className)}>
			<NextImage
				height={0}
				width={0}
				sizes="100vw"
				{...props}
				src={getSrc()}
				style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1 }}
			/>
		</div>
	)
}
