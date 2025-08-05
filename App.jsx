import { useState, useRef, useEffect } from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
	const [dice, setDice] = useState(() => generateAllNewDice())
	const [amountOfRerolls, setAmountOfRerolls] = useState(0)
	const [highScore, setHighScore] = useState(localStorage.getItem("highScore"))
	const [newHighScore, setNewHighScore] = useState(false)
	const gameWon = checkIfGameWon()
	const buttonRef = useRef(null)

	function checkIfGameWon() {
		if (dice.every((die) => die.isHeld) && dice.every((die) => die.value === dice[0].value)) {
			return true
		}
		return false
	}

	useEffect(() => {
		if (gameWon) {
			buttonRef.current.focus()
		}
	}, [gameWon])

	useEffect(() => {
		if (gameWon && amountOfRerolls < highScore) {
			localStorage.setItem("highScore", amountOfRerolls)
			setHighScore(amountOfRerolls)
			setNewHighScore(true)
		}
	}, [gameWon, amountOfRerolls, highScore])

	function generateAllNewDice() {
		return new Array(10).fill(0).map(() => ({
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		}))
	}

	function rollDice() {
		if (gameWon) {
			setDice(generateAllNewDice())
			setAmountOfRerolls(0)
		} else {
			setDice((prevDice) => prevDice.map((die) => (die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) })))
			setAmountOfRerolls((prevAmount) => prevAmount + 1)
		}
	}

	function hold(id) {
		setDice((prevDice) => prevDice.map((die) => (die.id === id ? { ...die, isHeld: !die.isHeld } : die)))
	}

	const diceElements = dice.map((dieObject) => (
		<Die
			key={dieObject.id}
			value={dieObject.value}
			isHeld={dieObject.isHeld}
			hold={() => hold(dieObject.id)}
		/>
	))

	return (
		<main className="flex h-full flex-col items-center justify-evenly rounded-[5px] bg-[#F5F5F5]">
			{gameWon && <Confetti />}
			<h1 className="text-2xl font-bold">Tenzies</h1>
			<p className="mx-5 text-center">
				Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
			</p>
			<div className="grid grid-cols-5 grid-rows-2 gap-3">{diceElements}</div>
			<button
				className="cursor-pointer rounded-[6px] bg-[#5035FF] px-5 py-3 text-xl whitespace-nowrap text-white"
				onClick={rollDice}
				ref={buttonRef}
			>
				{gameWon ? "New Game" : "Roll"}
			</button>
			<div className="flex gap-5">
				<button className="rounded-[6px] bg-[#5035FF] px-5 py-3 text-xl text-white">{`Rerolls: ${amountOfRerolls}`}</button>
				<button className="rounded-[6px] bg-[#5035FF] px-5 py-3 text-xl text-white">
					{gameWon && newHighScore ? `🎉 New Highscore!` : `Highscore: ${highScore}`}
				</button>
			</div>
		</main>
	)
}
