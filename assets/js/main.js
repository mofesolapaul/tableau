$(() => {
    // wrap tableaus in tableaus, and de-bleau them
    $('table.tableau').each((i, t) => {
        // props
        let cellWidth, minCellWidth = 240

        // clone the original table
        let tableau = $('<div></div>').addClass('tableau')
        let inner = $('<div></div>').addClass('tableau-inner')
        let table = $(t).clone().removeClass('tableau').addClass('bordered')

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

        // include the first column in the header
        firstCol.push($('th:first-of-type', thead)[0])

        // ensure the stability of first column
        firstCol.css({
            position: 'relative',
            left: 0
        })

        // on scroll
        tableau.scroll(function (e) {
            let _left = $(this).scrollLeft()
            let _top = $(this).scrollTop()
            thead.css('top', _top)
            firstCol.css({
                left: _left
            })
            if (_left != 0) firstCol.addClass('floating')
            else firstCol.removeClass('floating')
        })

        // do the dimensioning
        dimension()

        function dimension() {
            cellWidth = tableau.width() / colCount
            cellWidth = cellWidth < minCellWidth ? minCellWidth : cellWidth // normalize width
            thtd.css('width', cellWidth)
            // allow for the fix-positioned header
            tbody.css('marginTop', thead.height())
        }
    })
})
