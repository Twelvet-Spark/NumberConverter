function convertToBase() {
    let num = document.querySelector('.input-float').value;
    let type = document.querySelector('#input-type').value;

    // console.log(type); DEBUG

    let full_part = num.split('.')[0];
    let fract_part = num.split('.')[1];

    let sign_bit;
    let characteristic_len;
    let mantisse_len;


    // Set sign bit
    let full_part_bin

    if (parseInt(full_part) < 0) {
        sign_bit = 1;
        full_part_bin = (parseInt(full_part) * -1).toString(2); // Full part to binary without "-" sign
    }
    else {
        sign_bit = 0;
        full_part_bin = (parseInt(full_part)).toString(2);
    }

    // Set characteristic and mantisse lengths for each type of number
    if (type === 'float') {
        characteristic_len = 8;
        mantisse_len = 23;
    }
    else if (type === 'double') {
        characteristic_len = 11;
        mantisse_len = 52;
    }
    else if (type === 'extended') {
        characteristic_len = 15;
        mantisse_len = 65; // WARNING: With secret bit!
    }


    // Mantisse calculation
    let _rest_part = 0;
    let mantisse = [];
    let _cached_num = fract_part;
    for (let i = 0; i < mantisse_len; i++) {
        _rest_part = 0;
        
        _before_multiply = _cached_num;
        _cached_num *= 2; // To binary

        // console.log(_cached_num); DEBUG

        if (String(_cached_num).length > String(fract_part).length) {
            _rest_part = 1;
            // console.log(parseInt(String(String(_cached_num)[0]).concat(Array(String(fract_part).length+1).join('0')))); DEBUG
            _cached_num -= parseInt(String(String(_cached_num)[0]).concat(Array(String(fract_part).length+1).join('0')));
        }

        // console.log(`${_before_multiply} умножается на ${2} = ${_cached_num} остаток = ${_rest_part}`) DEBUG

        mantisse.push(_rest_part);
    }

    console.log("Мантисса не нормализованная: " + mantisse.join("")); // DEBUG


    // Normalized mantisse calculation
    console.log("Конфигурация + не нормализованная мантисса: " + full_part_bin + "." + mantisse.join("")); // DEBUG

    let full_part_mantisse = full_part_bin + "." + mantisse.join("");
    let normalized_mantisse = [];
    let rangeToPoint = full_part_bin.length;
    let isPositive = true;

    console.log("Это должна быть точка: " + full_part_mantisse[rangeToPoint]);
    
    // Find the exponent and it's sign through the checking full part and fract part of the number
    let exponent = 0;
    let _exponentFound = false;

    if (!(full_part_mantisse.slice(0, 2) === "1.")) {
        // From start of the full part to the start of mantisse, check for "1" in full part to find order and it's sign
        for (let i = 0; i < rangeToPoint; i++) {
            if (full_part_mantisse[i] === "1") {
                exponent = rangeToPoint - (i + 1);
                isPositive = true;
                _exponentFound = true;
                break
            }
        }

        if (_exponentFound === false) {
            // From start of the fract part - mantisse to the end, check for "1" in fract part to find order and it's sign
            for (let i = rangeToPoint; i < full_part_mantisse.length; i++) {
                if (full_part_mantisse[i] === "1") {
                    exponent = i - 1;
                    isPositive = false;
                    break
                }
            }
        }
    }
    else {
        normalized_mantisse = full_part_mantisse.split(""); // If we already have 1. in the beggining of the number, so it's already normalized
    }

    if (exponent !== 0) {
        // Set the exponent sign to the correct one using information from cycles that find exponent
        if (!isPositive) {
            exponent = -exponent;
        }

        // Setting up normalized mantisse, using exponent
        if (exponent > 0) {
            console.log(full_part_bin.length - exponent); // DEBUG
            normalized_mantisse = (full_part_bin + mantisse.join("")).split("");
            normalized_mantisse.splice(full_part_bin.length - exponent, 0, '.');
        }
        else if (exponent < 0) {
            console.log(full_part_bin.length + (exponent * -1)); // DEBUG
            normalized_mantisse = (full_part_bin + mantisse.join("")).split("");
            normalized_mantisse.splice(full_part_bin.length + (exponent * -1), 0, '.');
        }
    }
    console.log("Смещение: " + exponent);
    console.log("Нормализованная мантисса: " + normalized_mantisse.join(""));


    // Characteristic calculation
    let characteristic_max_num = "".concat(Array(characteristic_len+1).join("1"));
    let characteristic;
    let shift;

    shift = (("0b" + characteristic_max_num) >>> 1);
    characteristic = Number(parseInt(shift.toString(2), 2)) + Number(parseInt(exponent.toString(2), 2));

    console.log("Максимальное число " + characteristic_max_num);
    console.log("Смещение " + shift.toString(2));
    console.log("Характеристика " + characteristic.toString(2));


    // Complete number in binary format
    let complete_num_bin;

    if (type === "extended") {
        normalized_mantisse.splice(1, 1)
        complete_num_bin = sign_bit.toString(2) + characteristic.toString(2) + normalized_mantisse.join("");
    }
    else if (type === "double" || type === "float") {
        normalized_mantisse.splice(0, 2);
        complete_num_bin = sign_bit.toString(2) + characteristic.toString(2) + normalized_mantisse.join("");
    }

    console.log("Готовое число " + complete_num_bin);
    console.log("Готовое HEX " + parseInt(complete_num_bin, 2).toString(16));

    console.log();
}