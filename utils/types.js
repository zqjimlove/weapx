const objToString = Object.prototype.toString;
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return objToString.call(value);
}

function isObject(value) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}

function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

function isString(value) {
  const type = typeof value;
  return (
    type == "string" ||
    (type == "object" &&
      value != null &&
      !Array.isArray(value) &&
      baseGetTag(value) == "[object String]")
  );
}

function isNumber(value) {
  return (
    typeof value == "number" ||
    (isObjectLike(value) && baseGetTag(value) == "[object Number]")
  );
}

function isArray(obj) {
  return (
    obj !== null &&
    (Array.isArray
      ? Array.isArray(obj)
      : Object.prototype.toString.call(obj) === "[object Array]")
  );
}

const isFunction = v => typeof v === "function";

export default {
  isObject,
  isObjectLike,
  isString,
  isNumber,
  isFunction,
  isArray
};
