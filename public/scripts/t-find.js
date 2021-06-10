$("#button-search").click(function(event) {
    event.preventDefault();

    var search = $("#field-search").val();
    console.log(search);

    if (validateSearch) {
        $.get("/findT", {search}, (data, status) => {
            //window.location.assign(`/t?search=${search}`);
            location.href= `/t?search=${search}`;
            $.get(`/t?search=${search}`, {search});
            console.log(search);
        }).done(function(res) {
            //location.href= "/";
        });
    }
});

function validateSearch(value) {
    return (value == "");
}