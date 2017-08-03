$(() => {
    // wrap tableaus in tableaus, and de-bleau them
    $('table.tableau').each((i, t) => {
        // props
        let cellWidth

        // clone the original table
        let tableau = $('<div></div>').addClass('tableau')
        let inner = $('<div></div>').addClass('tableau-inner')
        let table = $(t).clone().removeClass('tableau')

        // place the tableau
        table.appendTo(inner)
        inner.appendTo(tableau)
        tableau.insertBefore(t)

        // remove the original table
        t.remove()

        // tableau parts
        let thead = $('thead', $(table))
        let tbody = $('tbody', $(table))
        let firstCol = $('td:first-of-type', tbody)
        let colCount = $('tr:first-of-type>th', thead).length
        let thtd = $('th,td', tableau)

        // allow for the fix-positioned header
        inner.css('marginTop', thead.height())

        // ensure the stability of first column
        firstCol.css({
            position: 'absolute',
            left: 0
        })

        // allow for the fix-positioned first column
        tbody.css('paddingLeft', firstCol.width())

        // on scroll
        tableau.scroll(function (e) {
            let _left = $(this).scrollLeft()
            let _top = $(this).scrollTop()
            thead.css('left', -_left)
        })

        // do the dimensioning
        dimension()

        function dimension() {
            cellWidth = tableau.width() / colCount
            thtd.css('width', cellWidth)
            tbody.css('paddingLeft', cellWidth)
        }
    })
})
