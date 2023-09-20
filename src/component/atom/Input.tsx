import { cx } from "@/helper"

type InputProps = React.HTMLProps<HTMLInputElement> & {
	containerClassName?: string
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

const Input = ({ containerClassName, className, leftIcon, rightIcon, ...props }: InputProps) => {
	return (
		<label
			className={cx(
				'bg-white rounded-lg overflow-hidden flex gap-2 outline outline-1 outline-offset-[-1px] outline-transparent transition-all',
				'focus-within:outline-green-500',
				containerClassName
			)}
		>
			{leftIcon}
			<input
				className={cx(
					'py-2 px-4 w-full rounded-lg',
					'focus:outline-none focus:border-none',
					className
				)}
				{...props}
			/>
			{rightIcon}
		</label>
	)
}

export default Input
