import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import {
  bubbleSort,
  mergeSort,
  quickSort,
  heapSort,
} from "./sortingAlgorithms";

const ArrayBar = React.memo(({ height, isActive, isSorted }) => (
  <div
    className={`array-bar ${
      isActive ? "bg-red-500" : isSorted ? "bg-green-500" : "bg-teal-500"
    }`}
    style={{ height: `${height}px`, width: "10px", margin: "0 2px" }}
  ></div>
));

const App = () => {
  const [array, setArray] = useState([]);
  const [speed, setSpeed] = useState(11); // Speed control state
  const [numElements, setNumElements] = useState(50); // Number of elements control state
  const [algorithm, setAlgorithm] = useState("bubbleSort"); // Selected sorting algorithm
  const [activeBars, setActiveBars] = useState([]); // Currently active bars
  const [sortedBars, setSortedBars] = useState([]); // Sorted bars

  useEffect(() => {
    resetArray();
  }, [numElements]);

  const resetArray = useCallback(() => {
    const newArray = Array.from(
      { length: numElements },
      () => Math.floor(Math.random() * 350) + 10
    );
    setArray(newArray);
    setActiveBars([]);
    setSortedBars([]);
  }, [numElements]);

  const handleSort = async () => {
    setActiveBars([]);
    setSortedBars([]);
    let sortedArray;
    switch (algorithm) {
      case "bubbleSort":
        sortedArray = await bubbleSort(array, setArray, setActiveBars, speed);
        break;
      case "mergeSort":
        sortedArray = await mergeSort(array, setArray, setActiveBars, speed);
        break;
      case "quickSort":
        sortedArray = await quickSort(array, setArray, setActiveBars, speed);
        break;
      case "heapSort":
        sortedArray = await heapSort(array, setArray, setActiveBars, speed);
        break;
      default:
        break;
    }
    setArray(sortedArray);
    setSortedBars(new Array(sortedArray.length).fill(true));
    setActiveBars([]);
  };

  return (
    <div className="App">
      <header className="text-center p-4">
        <h1 className="text-3xl font-bold text-white">Sorting Algorithm's Visualizer</h1>
      </header>
      <div className="flex justify-center">
        <div className="h-[1px] w-3/5 bg-slate-400"></div>
      </div>

      <div className="controls p-2 text-center">
        <button
          onClick={resetArray}
          className="m-2 p-2 px-6 bg-blue-500 text-white rounded font-semibold"
        >
          Generate New Array
        </button>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="m-2 p-2 rounded border"
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
          <option value="heapSort">Heap Sort</option>
        </select>
        <span className="text-white">Bar Count</span>
        <input
          type="range"
          min="5"
          max="80"
          value={numElements}
          onChange={(e) => setNumElements(Number(e.target.value))}
          className="m-2"
        />
        <span className="text-white">Speed</span>
        <input
          type="range"
          min="10"
          max="30"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="m-2"
        />
        <button
          onClick={handleSort}
          className="m-2 p-2 px-4 bg-green-500 text-white rounded font-semibold"
        >
          Sort
        </button>
      </div>
      <div className="pb-1 array-container flex justify-center flex-wrap border-2 border-gray-600 border-opacity-40 rounded bg-slate-900 bg-opacity-20">
        {array.map((value, index) => (
          <ArrayBar
            key={index}
            height={value}
            isActive={activeBars.includes(index)}
            isSorted={sortedBars[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
