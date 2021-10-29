// function arguments:
// arr: Входной массив для сортировки
// assert: Строка, определяющая метод сортировки (type - по типу данных в массиве, length - по длине строк в массиве)

const sortedFunc = (arr, assert) => {
  // Проверяем, пришел на вход массив или нет, если нет - выводим ошибку.
  if (arr.constructor !== Array) {
    return "arr is not an array";
  }

  // params:
  //    @methodSort: "переключатель" работы функции.
  //    @count: счетчик для определения, состоит массив только из строк или нет.
  var methodSort;
  var count = 0;
  arr.map((item) => {
    if (typeof item !== "string") {
      count++;
    }
  });
  // Устанавливаем значение для methodSort - если в массиве встретились типы,
  // отличные от string, то в дальнейшем возвращаем разбивку по типам, иначе по длине.
  if (!!count) {
    methodSort = "type";
  } else {
    methodSort = "length";
  }

  // Сравниваем, совпадает ли methodSort с "пожеланиями" юзера.
  if (methodSort !== assert) {
    return "status is not valid";
  }

  var resultObject = {};

  // Функция, которая создает свойства объекта и массивы, как значение.
  const pushProperty = (object, type, value) => {
    object[type]
      ? (object[type] = [...object[type], value])
      : (object[type] = [value]);
    return object;
  };

  if (assert === "type") {
    arr.map((item) => pushProperty(resultObject, typeof item, item));
  } else if (assert === "length") {
    arr.map((item) => {
      switch (item.length) {
        case 0:
        case 1:
          pushProperty(resultObject, "less", item);
          break;
        default:
          pushProperty(resultObject, "more", item);
          break;
      }
    });
  } else {
    return "assert is not valid";
  }
  return resultObject;
};

console.log(sortedFunc([123, "123", "321", () => {}, 9000, {}, []], "type"));
console.log(sortedFunc(["123", "1", "Hello!", ""], "length"));
