import { SVGProps } from "react";

const RightDownCurveArrow = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			fill="none"
			height="24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				d="M20.63 13.77 13 20v-4C5.9 15.72 3 9.87 3 4c0 0 3.88 5.69 10 6V6l7.63 6.23a1 1 0 0 1 0 1.54Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="currentColor"
			/>
		</svg>
	);
};

export default RightDownCurveArrow;
