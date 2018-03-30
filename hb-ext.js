Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    if (arguments.length < 4) {
        // Operator omitted, assuming "+"
        options = rvalue;
        rvalue = operator;
        operator = "+";
    }

    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});
Handlebars.registerHelper("isChecked", function(index, userChoice) {
    if(userChoice===index+1)
    {
        return 'checked';
    }
    else{
        return '';
    }
});
Handlebars.registerHelper("isCorrect", function(correctAnswer, userChoice) {
    if(userChoice===correctAnswer)
    {
        return "class=correct";
    }
    else{
        return "class=incorrect";
    }
});
Handlebars.registerHelper("letterChoice", function(choice) {
    switch (choice){
        case 1:
        return "a"
        break;
        case 2:
        return "b"
        break;
        case 3:
        return "c"
        break;
        case 4:
        return "d"
        break;
        default:
        return
        break;
    }
});
Handlebars.registerHelper("letterQtn", function(choice) {
    switch (choice){
        case 0:
        return "a"
        break;
        case 1:
        return "b"
        break;
        case 2:
        return "c"
        break;
        case 3:
        return "d"
        break;
        default:
        return
        break;
    }
});