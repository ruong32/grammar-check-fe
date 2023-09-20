import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    [
        'flex items-center px-3 py-1 rounded-md border-[1px] transition-[filter] duration-300',
        'hover:brightness-105',
        'disabled:opacity-50 disabled:pointer-events-none',
    ], 
    {
        variants: {
            variant: {
                filled: 'bg-[var(--button-color)] border-[var(--button-color)]',
                outline: 'bg-transparent border-[var(--button-color)] text-[var(--button-color)]',
            },
            color: {
                orange: `[--button-color:--color-orange-500]`,
                red: '[--button-color:--color-red-600]',
                green: '[--button-color:--color-green-600]',
                gray: '[--button-color:--color-gray-500]',
            },
            align: {
                left: 'justify-start',
                center: 'justify-center',
                right: 'justify-end'
            }
        },
        defaultVariants: {
            variant: 'filled',
            color: 'orange',
            align: 'center'
        }
    }
)

type ButtonProps = 
    VariantProps<typeof buttonVariants> & 
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>& {
        leftIcon?: React.ReactNode
        rightIcon?: React.ReactNode
    }

const Button = ({ variant, color, className, children, leftIcon, rightIcon, ...props }: ButtonProps) => {
    return (
        <button className={buttonVariants({ variant, color, className })} {...props}>
            { leftIcon }
            { children }
            { rightIcon }
        </button>
    )
}

export default Button
