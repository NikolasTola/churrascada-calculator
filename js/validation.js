function validateNumericInput(input, allowFloat = true) {
    let value = input.value;
    
    if (allowFloat) {
        value = value.replace(/[^0-9.,]/g, '');
        value = value.replace(',', '.');
        
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
    } else {
        value = value.replace(/[^0-9]/g, '');
    }
    
    input.value = value;
}

function isValidNumber(value, allowFloat = true) {
    if (!value || value.trim() === '') {
        return false;
    }
    
    const num = parseFloat(value);
    
    if (isNaN(num) || num < 0) {
        return false;
    }
    
    if (!allowFloat && !Number.isInteger(num)) {
        return false;
    }
    
    return true;
}