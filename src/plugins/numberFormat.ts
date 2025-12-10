import Big from "big.js";
import { envChangeType, envType } from "./utils";

const zeroNumber = (num: number) => {
  if (num === 0) return "0";
  let initZero = `0.`;
  for (let index = 0; index < num; index++) {
    initZero = initZero + "0";
  }

  return initZero;
};
const repeatNumber = (num: number) => {
  if (num === 0) return "0";
  let initZero = ``;
  for (let index = 0; index < num; index++) {
    initZero = initZero + "0";
  }

  return initZero;
};

function isInt(n: number) {
  return n % 1 === 0;
}

export const moneyFormat = (
  number: number,
  minDecimalPoint = envChangeType(
    "VITE_APP_MIN_DECIMAL_POINT",
    envType.NUMBER
  ) as number,
  maxDecimalPoint = envChangeType(
    "VITE_APP_MAX_DECIMAL_POINT",
    envType.NUMBER
  ) as number,
  thousandSeparator = envChangeType("VITE_APP_THOUSANDS_SEPARATOR") as string,
  decimalSeparator = envChangeType("VITE_APP_DECIMAL_SEPARATOR") as string
) => {
  const float = parseFloat(
    isNaN(number) || !number ? "0.0" : number.toString()
  ); //check undefined and null
  const round = Math.round(float * Math.pow(10, 10)) / Math.pow(10, 10); //round down to 5 decimal point
  const regex = RegExp(`0{0,${maxDecimalPoint - minDecimalPoint}}$`, "g"); //build regex with parameters
  //const format = round.toFixed(maxDecimalPoint).replace(regex, ""); //limit digit to 5 decimal point, and remove trailing zero until min limit
  const bigNumber = Big(round).round(maxDecimalPoint, Big.roundDown);
  const format =
    bigNumber.toString() === "0"
      ? zeroNumber(maxDecimalPoint)
      : bigNumber.toString().replace(regex, "");

  const split = format.split("."); //separate decimal and the number
  const join = isInt(bigNumber.toNumber())
    ? maxDecimalPoint <= 0
      ? `${split[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)}`
      : `${split[0].replace(
          /\B(?=(\d{3})+(?!\d))/g,
          thousandSeparator
        )}${decimalSeparator}${repeatNumber(maxDecimalPoint)}`
    : [
        split[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator),
        split[1],
      ].join(decimalSeparator); //format thousand separator
  // console.log(split[1]);

  return join;
};

export const moneyBetButtonFormat = (
  number: number,
  minDecimalPoint = envChangeType(
    "VITE_APP_MIN_DECIMAL_POINT",
    envType.NUMBER
  ) as number,
  maxDecimalPoint = envChangeType(
    "VITE_APP_MAX_DECIMAL_POINT",
    envType.NUMBER
  ) as number,
  thousandSeparator = envChangeType("VITE_APP_THOUSANDS_SEPARATOR") as string,
  decimalSeparator = envChangeType("VITE_APP_DECIMAL_SEPARATOR") as string
) => {
  const float = parseFloat(
    isNaN(number) || !number ? "0.0" : number.toString()
  ); //check undefined and null
  const round = Math.round(float * Math.pow(10, 10)) / Math.pow(10, 10); //round down to 5 decimal point
  const regex = RegExp(`0{0,${maxDecimalPoint - minDecimalPoint}}$`, "g"); //build regex with parameters
  //const format = round.toFixed(maxDecimalPoint).replace(regex, ""); //limit digit to 5 decimal point, and remove trailing zero until min limit
  const bigNumber = Big(round).round(maxDecimalPoint, Big.roundDown);
  const format =
    bigNumber.toString() === "0"
      ? zeroNumber(maxDecimalPoint)
      : bigNumber.toString().replace(regex, "");
  const split = format.split("."); //separate decimal and the number
  // console.log(bigNumber.toNumber(), isInt(bigNumber.toNumber()));
  const join = isInt(bigNumber.toNumber())
    ? maxDecimalPoint <= 0
      ? `${split[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)}`
      : `${split[0].replace(
          /\B(?=(\d{3})+(?!\d))/g,
          thousandSeparator
        )}${decimalSeparator}${repeatNumber(maxDecimalPoint)}`
    : [
        split[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator),
        split[1].padEnd(minDecimalPoint, "0"),
      ].join(decimalSeparator); //format thousand separator
  // console.log(split[1]);

  return join;
};

export const thousandFormat = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};
