import { nanoid } from "nanoid"

export default function Die(props) {
	const pipPositions = {
		1: [4],
		2: [0, 8],
		3: [0, 4, 8],
		4: [0, 2, 6, 8],
		5: [0, 2, 4, 6, 8],
		6: [0, 2, 3, 5, 6, 8],
	}
	const dots = pipPositions[props.value]
	const styles = {
		backgroundColor: props.isHeld ? "#59E391" : "white",
	}

	return (
		<button
			onClick={props.hold}
			style={styles}
			className={`${dots.length === 6 ? "px-2" : ""} grid h-13 w-13 cursor-pointer grid-cols-3 grid-rows-3 rounded-xl border-1 p-1 text-xl font-bold shadow-[0px_2px_2px_rgba(0,0,0,0.15)]`}
			aria-pressed={props.isHeld}
			aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
		>
			{new Array(9).fill(0).map((_, index) => (
				<div
					className="flex items-center justify-center"
					key={nanoid()}
				>
					{dots.includes(index) && <span className="h-1.5 w-1.5 rounded-xl bg-black"></span>}
				</div>
			))}
		</button>
	)
}
