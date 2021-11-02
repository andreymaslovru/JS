const counterSocks = (arr) => {
  if (arr.constructor !== Array) {
    return "Аргумент не является массивом";
  }

  var count = 0;

  arr.map((item) => {
    if (typeof item !== "number") {
      count++;
    }
  });

  if (count) {
    return "Массив неоднотипен";
  }

  var counter = 0;
  arr.sort();
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      counter++;
      arr[i] = null;
      arr[i + 1] = null;
    }
  }
  return counter;
};
console.log(counterSocks([1, 2, 1]));
console.log(counterSocks(1));
console.log(counterSocks([1, 2, 1, 1, 2, 1, 3, 4, 3]));
console.log(counterSocks([1, 2, 1, 1, 2, 1, 3, 4, 3, ""]));
