// sortingAlgorithms.js

// Utility to batch state updates for animations
export const batchStateUpdates = async (
  updates,
  setArray,
  setActiveBars,
  speed
) => {
  for (const update of updates) {
    if (update.type === "array") {
      setArray(update.value);
    } else if (update.type === "activeBars") {
      setActiveBars(update.value);
    }
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
};

// Bubble Sort Algorithm with animation
export const bubbleSort = async (array, setArray, setActiveBars, speed) => {
  let arr = array.slice();
  let updates = [];
  let sorted = false;
  let round = 0;

  while (!sorted) {
    sorted = true;
    for (let i = 0; i < arr.length - 1 - round; i++) {
      updates.push({ type: "activeBars", value: [i, i + 1] });
      if (arr[i] > arr[i + 1]) {
        updates.push({ type: "activeBars", value: [i, i + 1] });
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        updates.push({ type: "array", value: arr.slice() });
        updates.push({ type: "activeBars", value: [] });
      }
    }
    updates.push({ type: "activeBars", value: [true, arr.length - 1 - round] });
    round++;
  }

  await batchStateUpdates(updates, setArray, setActiveBars, speed);
  return arr;
};

export const mergeSort = async (array, setArray, setActiveBars, speed) => {
  const merge = async (left, right) => {
    let arr = [];
    let updates = [];
    while (left.length && right.length) {
      updates.push({ type: "activeBars", value: [left[0], right[0]] });
      if (left[0] < right[0]) {
        arr.push(left.shift());
      } else {
        arr.push(right.shift());
      }
      updates.push({ type: "array", value: arr.concat(left).concat(right) });
      await batchStateUpdates(updates, setArray, setActiveBars, speed);
      updates = [];
    }
    return [...arr, ...left, ...right];
  };

  const sort = async (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await sort(arr.slice(0, mid));
    const right = await sort(arr.slice(mid));
    const merged = await merge(left, right);
    return merged;
  };

  let sortedArray = await sort(array.slice());
  return sortedArray;
};

export const quickSort = async (array, setArray, setActiveBars, speed) => {
  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    let updates = [];
    for (let j = low; j < high; j++) {
      updates.push({ type: "activeBars", value: [j, high] });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        updates.push({ type: "array", value: arr.slice() });
        await batchStateUpdates(updates, setArray, setActiveBars, speed);
        updates = [];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    updates.push({ type: "array", value: arr.slice() });
    await batchStateUpdates(updates, setArray, setActiveBars, speed);
    return i + 1;
  };

  const sort = async (arr, low, high) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await sort(arr, low, pi - 1);
      await sort(arr, pi + 1, high);
    }
    return arr;
  };

  let sortedArray = await sort(array.slice(), 0, array.length - 1);
  return sortedArray;
};

export const heapSort = async (array, setArray, setActiveBars, speed) => {
  const heapify = async (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let updates = [];

    updates.push({ type: "activeBars", value: [i, left, right] });

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      updates.push({ type: "array", value: arr.slice() });
      await batchStateUpdates(updates, setArray, setActiveBars, speed);
      await heapify(arr, n, largest);
    }
  };

  const sort = async (arr) => {
    const n = arr.length;
    let updates = [];

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    for (let i = n - 1; i >= 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      updates.push({ type: "array", value: arr.slice() });
      await batchStateUpdates(updates, setArray, setActiveBars, speed);
      await heapify(arr, i, 0);
    }
    return arr;
  };

  let sortedArray = await sort(array.slice());
  return sortedArray;
};
