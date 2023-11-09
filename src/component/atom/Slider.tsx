'use client'

import { cx } from '@/helper';
import * as PrimitiveSlider from '@radix-ui/react-slider';

type SliderProps = PrimitiveSlider.SliderProps & {
	hideThumb?: boolean
	className?: string
	trackClassName?: string
	rangeClassName?: string
	thumbClassName?: string
	thumbTitle?: string
}

const Slider = ({className, hideThumb, trackClassName, rangeClassName, thumbClassName, thumbTitle, ...props}: SliderProps) => {
	return (
		<PrimitiveSlider.Root
			className={cx(
				'relative flex items-center select-none touch-none h-[1.25rem] w-[8rem]',
				className
			)}
			{...props}
		>
			<PrimitiveSlider.Track
				className={cx(
					'bg-gray-100 relative grow-1 h-[.25rem] w-full rounded-full',
					'dark:bg-slate-600',
					trackClassName
				)}
			>
				<PrimitiveSlider.Range 
					className={cx(
						'absolute bg-indigo-600 rounded-full h-full',
						rangeClassName
					)}
				/>
			</PrimitiveSlider.Track>
			{
				!hideThumb &&
				<PrimitiveSlider.Thumb
					title={thumbTitle}
					className={cx(
						'block h-[1.25rem] w-[1.25rem] bg-white border-1 rounded-full shadow-[0_0_0.1875rem_#00000060]',
						'dark:bg-gray-200',
						'focus:outline-none',
						thumbClassName
					)}
				/>
			}
		</PrimitiveSlider.Root>
	)
}

export default Slider
