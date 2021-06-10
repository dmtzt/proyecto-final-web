$("#button-search").click(function(event) {
    event.preventDefault();

    var search = $("#field-search").val();
    console.log(search);

    if (validateSearch) {
        $.post("/findT", {search}, (data, status) => {
            window.location.assign('/');
        }).done(function(res) {
            location.href= "/t";
        });
    }
});

function validateSearch(value) {
    return (value == "");
}