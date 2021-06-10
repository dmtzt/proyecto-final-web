$("#button-join").click(function(event) {
    event.preventDefault();

    var code = $("#field-join").val();
    console.log(code);
 
    if (validateJoin) {
        $.post("/joinT", {code} );    
    }
});

function validateJoin(value) {
    return (value == "");
}