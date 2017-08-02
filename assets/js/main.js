$(() => {
    // wrap tableaus in tableaus, and de-bleau them
    $('table.tableau').each((i,t) => {
        let div = $('<div></div>').addClass('tableau')
        $(t).clone().removeClass('tableau').appendTo(div)
        div.insertBefore(t)
        console.log($(t))
    })
})
