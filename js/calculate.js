function convertToBase() {
    let num = document.querySelector('.input-float').value;
    let type = document.querySelector('#input-type').value;

    // console.log(type); DEBUG

    let full_part = num.split('.')[0];
    let full_part_bin = parseInt(full_part).toString(2)
    let fract_part = num.split('.')[1];

    let sign_bit;
    let characteristic_len;
    let mantisse_len;
    let shift;

    // Set sign bit
    if (parseInt(full_part) < 0) {
        sign_bit = 1;
    }
    else {
        sign_bit = 0;
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
        
        _before_multiply = _cached_num
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

    let full_part_mantisse = full_part_bin + "." + mantisse.join("")
    let normalized_mantisse;
    let rangeToPoint = full_part_bin.length
    let isPositive = true;

    console.log("Эта должна быть точка: " + full_part_mantisse[rangeToPoint]);

    let exponent = 0;
    let exponentFound = false;

    // Find the exponent and it's sign through the checking full part and fract part of the number
    if (!(full_part_mantisse.slice(0, 2) === "1.")) {
        // From start of the full part to the start of mantisse, check for "1" in full part to find order and it's sign
        for (let i = 0; i < rangeToPoint; i++) {
            if (full_part_mantisse[i] === "1") {
                exponent = rangeToPoint - (i + 1);
                isPositive = true;
                exponentFound = true;
                break
            }
        }

        if (exponentFound === false) {
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
        normalized_mantisse = full_part_mantisse // If we already have 1. in the beggining of the number, so it's already normalized
    }

    // Set the exponent sign to the correct one using information from cycles that find exponent
    if (!isPositive) {
        exponent = -exponent
    }

    console.log("Смещение: " + exponent)

    // for (let i = 0; i < full_part_mantisse.length; i++) {
    //     if (full_part_mantisse[i] === ".") {
    //         isPositive = false;
    //     }
    //     if (full_part_mantisse[i] === "1") {
    //         exponent = i
    //     }
    // }
}