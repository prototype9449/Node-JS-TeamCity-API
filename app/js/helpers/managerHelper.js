$(
    $(document).on('mouseover','.panel-heading',function(){
        var innerText = $(this).text();
        $(this).tooltip({title: innerText});
    })
);