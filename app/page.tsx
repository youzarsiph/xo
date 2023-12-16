/**
 * XO Game
 */

"use client";

import React from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const XO = () => {
  const [score, setScore] = React.useState<number>(0);
  const [turn, setTurn] = React.useState<boolean>(false);
  const [winner, setWinner] = React.useState<undefined | boolean>(undefined);
  const [state, setState] = React.useState<number[][]>([
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]);

  React.useEffect(() => {
    if (turn) {
      setTimeout(() => {
        playXO();
      }, 750);
    }

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, turn]);

  /**
   * Resets the state
   */
  const resetState = () =>
    setState([
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ]);

  /**
   * Updates the state with given value
   * @param row row index
   * @param col col index
   * @param value the new value for state[row][col]
   */
  const updateState = (row: number, col: number, value: number) => {
    // Temporary variables
    const tempState = state;

    // Update temp vars
    tempState[row][col] = value;

    // Update state
    setState(tempState);

    // Change turn
    setTurn(!turn);
  };

  /**
   * Simulates XO game play
   */
  const playXO = () => {
    let breakOuterFor = false;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state.length; col++) {
        if (
          row * col === 4 ||
          (state[row][col] === -1 && Math.random() > 0.5)
        ) {
          updateState(row, col, 1);

          breakOuterFor = true;
          break;
        }
      }
      if (breakOuterFor) {
        break;
      }
    }
  };

  /**
   * Sets the winner and resets the game
   * @param winner the winner of the game
   */
  const endGame = (winner: boolean) => {
    setWinner(winner);

    // Update player's score
    if (!winner) {
      setScore(score + 100);
    }

    resetState();

    // Restart the game
    setTimeout(() => {
      setWinner(undefined);
    }, 2000);
  };

  /**
   * Checks for game end states
   */
  const check = () => {
    let foundWinner = false;

    // Checks the rows
    state.forEach((row: number[]) => {
      if (row.every((value) => value === 1)) {
        endGame(true);
        foundWinner = true;
      }
      if (row.every((value) => value === 0)) {
        endGame(false);
        foundWinner = true;
      }
    });
    
    const diameters: number[][] = [[], []];
    const stateTrans: number[][] = [[], [], []];

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state.length; col++) {
        // Build state trans
        stateTrans[row].push(state[col][row]);

        if (row === col) {
          diameters[0].push(state[row][col]);
          diameters[1].push(state[row][state.length - (col + 1)]);
        }
      }
    }

    // Check the columns
    if (!foundWinner) {
      stateTrans.forEach((row: number[]) => {
        if (row.every((value) => value === 1)) {
          endGame(true);
          foundWinner = true;
        }
        if (row.every((value) => value === 0)) {
          endGame(false);
          foundWinner = true;
        }
      });
    }

    // Checks the diameters
    if (!foundWinner) {
      diameters.forEach((row: number[]) => {
        if (row.every((value) => value === 1)) {
          endGame(true);
        }
        if (row.every((value) => value === 0)) {
          endGame(false);
        }
      });
    }
  };

  const Alert = () => (
    <div
      role="alert"
      className={`mx-8 flex w-full items-center gap-4 rounded-xl border px-8 py-4 shadow-2xl ring-8 ring-opacity-75 ring-offset-2 ${
        winner !== undefined
          ? winner
            ? "border-red-400 shadow-red-200 ring-red-300 dark:border-red-600 dark:shadow-red-600 dark:ring-red-500"
            : "border-green-400 shadow-green-200 ring-green-300 dark:border-green-600 dark:shadow-green-600 dark:ring-green-500"
          : "border-purple-400 shadow-purple-200 ring-purple-300 dark:border-purple-600 dark:shadow-purple-600 dark:ring-purple-500"
      }`}
    >
      {winner !== undefined ? (
        winner ? (
          <>
            <XMarkIcon className="h-8 w-8 text-red-400" />
            <p className="text-lg text-red-500">Computer is the winner!</p>
          </>
        ) : (
          <>
            <CheckIcon className="h-8 w-8 text-green-400" />
            <p className="text-lg text-green-500">You are the winner!</p>
          </>
        )
      ) : (
        <>
          <InformationCircleIcon className="h-8 w-8 text-purple-400" />
          <p className="text-lg text-purple-500">
            {turn ? "Computer's" : "Your"} turn
          </p>
        </>
      )}
    </div>
  );

  const Grid = () => (
    <div className="grid grid-cols-3 grid-rows-3 gap-8 rounded-3xl bg-gradient-to-tr from-green-500 to-blue-500 p-8 shadow-xl ring-8 ring-blue-500 ring-opacity-75 ring-offset-2 dark:bg-gradient-to-r dark:from-sky-400 dark:to-fuchsia-500 dark:ring-fuchsia-500 dark:ring-opacity-75">
      {state.map((row: number[], rowIndex: number) =>
        row.map((col: number, colIndex: number) => (
          <button
            key={`col-${colIndex}`}
            disabled={col === 1 || col === 0}
            onClick={() => updateState(rowIndex, colIndex, 0)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/75 shadow-sm ring-8 backdrop-blur-3xl ${
              col === -1
                ? "ring-transparent"
                : col === 0
                  ? "ring-green-400"
                  : "ring-red-400"
            } ring-opacity-75 hover:scale-150 hover:shadow-xl hover:ring-white hover:ring-opacity-75 active:scale-125`}
          >
            {col === -1 ? undefined : col === 0 ? (
              <CheckCircleIcon className="text-green-400" />
            ) : (
              <XCircleIcon className="text-red-400" />
            )}
          </button>
        )),
      )}
    </div>
  );

  const Buttons = () => (
    <div className="flex w-full items-center justify-between gap-8">
      <button
        type="button"
        onClick={() => resetState()}
        className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-4 font-bold tracking-widest text-white shadow-xl shadow-fuchsia-400 ring-8 ring-fuchsia-400 ring-opacity-75 ring-offset-2 hover:scale-110 hover:shadow-2xl hover:shadow-fuchsia-500 active:scale-100 dark:shadow-fuchsia-600 dark:ring-fuchsia-500 lg:px-8 lg:text-xl"
      >
        Try Again
      </button>
      <div className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-4 py-4 shadow-xl shadow-green-400 ring-8 ring-sky-400 ring-opacity-75 ring-offset-2 dark:shadow-green-600 dark:ring-sky-500 lg:px-8">
        <p className="font-bold tracking-widest text-white lg:text-xl">
          Score: {score}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-rows-2 dark:bg-slate-900 lg:h-screen lg:w-screen lg:grid-cols-2 lg:grid-rows-1">
      <header className="relative flex h-full w-full items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-3xl dark:from-stone-900/50"></div>

        <div className="absolute left-0 top-0 h-60 w-32 animate-pulse rounded-3xl bg-gradient-to-t from-sky-400 to-lime-500 lg:h-[35rem] lg:w-32"></div>
        <div className="absolute bottom-0 right-0 h-60 w-32 animate-pulse rounded-3xl bg-gradient-to-b from-sky-400 to-fuchsia-500 lg:h-[35rem] lg:w-32"></div>

        <div className="absolute inset-1/4 h-56 w-56 animate-spin rounded-full border-[4rem] border-b-sky-500 border-l-fuchsia-500 border-r-rose-500 border-t-green-500 lg:inset-1/3"></div>

        <div className="absolute right-0 top-0 h-32 w-60 animate-pulse rounded-3xl bg-gradient-to-r from-orange-600 to-yellow-400 lg:h-32 lg:w-[30rem]"></div>
        <div className="absolute bottom-0 left-0 h-32 w-60 animate-pulse rounded-3xl bg-gradient-to-l from-sky-400 to-teal-600 lg:h-32 lg:w-[30rem]"></div>

        <div className="relative z-20 grid gap-16">
          <h1 className="bg-gradient-to-r from-sky-400 to-fuchsia-400 bg-clip-text text-center text-9xl font-extrabold tracking-widest text-transparent dark:from-sky-500 dark:to-fuchsia-500">
            XO
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-50">
          <p className="text-center font-mono font-semibold text-stone-800 dark:text-white">
            Yousef Abu Shanab
          </p>
        </div>
      </header>

      <main className="relative flex flex-col items-center justify-center gap-16 px-4 py-8 lg:px-16 lg:py-16">
        <Alert />

        <Grid />

        <Buttons />
      </main>
    </div>
  );
};

export default XO;
