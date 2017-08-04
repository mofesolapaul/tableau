let Tableau = function (config = {}) {
    // it's called jQuery plugin for a reason
    if (typeof $ == 'undefined') {
        if (typeof jQuery != 'undefined') var $ = jQuery
        else throw ReferenceError("jQuery is required to use Tableau")
    }

    // scan the config
    config = $.extend({
        minCellWidth: 240,
        bordered: true,
        firstColumnWidth: null
    }, config)
    console.log(config)

    // wrap tableaus in tableaus, and de-bleau them
    $('table.tableau, .tableau>.tableau-inner>table').each(function (i, t) {
        // know if this is an already formatted tableau
        let isBleau = $(this).parent().hasClass('tableau-inner') && $(this).parent().parent().hasClass('tableau')

        // props
        let cellWidth, thead, tbody, firstCol, colCount, thtd, scrollListen = false

        // clone the original table
        let tableau = isBleau ? $(this).parent().parent() : $('<div></div>').addClass('tableau')
        let inner = isBleau ? $(this).parent() : $('<div></div>').addClass('tableau-inner')
        let table = isBleau ? $(t) : $(t).clone().removeClass('tableau')

        // place the tableau
        if (!isBleau) {
            table.appendTo(inner)
            inner.appendTo(tableau)
            tableau.insertBefore(t)

            // remove the original table
            t.remove()
        }

        // do the dimensioning
        dimension()

        // on scroll
        tableau.scroll(function (e) {
            if (!scrollListen) return

            let _left = $(this).scrollLeft()
            let _top = $(this).scrollTop()
            thead.css('top', _top)
            firstCol.css({
                left: _left
            })

            if (_left != 0) firstCol.addClass('floating')
            else firstCol.removeClass('floating')
        })

        // dimensions the table
        function dimension() {
            // tableau parts
            thead = $('thead', $(table))
            tbody = $('tbody', $(table))
            firstCol = $('td:first-of-type', tbody)
            colCount = $('tr:first-of-type>th', thead).length
            thtd = $('th,td', tableau)

            // bordered?
            table.addClass(config.bordered ? 'bordered' : '')

            // include the first column in the header
            firstCol.push($('th:first-of-type', thead)[0])

            // ensure the stability of first column
            firstCol.css({
                position: 'relative',
                left: 0
            })

            // calculate cell width
            cellWidth = tableau.width() / colCount
            cellWidth = cellWidth < config.minCellWidth ? config.minCellWidth : cellWidth // normalize width
            thtd.css('min-width', cellWidth)

            // allow for the fix-positioned header
            tbody.css('marginTop', thead.height())

            // apply cell width for first column
            firstCol.css({
                minWidth: config.firstColumnWidth == null ? cellWidth : config.firstColumnWidth
            })

            // enable listening
            scrollListen = true
        }

        // remove behaviours
        function misbehave() {
            scrollListen = false
            thead.css({
                top: 0
            })
            firstCol.css({
                left: 0
            }).removeClass('floating')
        }

        // attach refresh function to tableau
        tableau[0].tableau = {
            refresh: (newConfig = {}) => {
                config = $.extend(config, newConfig)
                misbehave()
                dimension()
            },
            styleOnly: misbehave
        }

        // TODO: completely detach first column for easy floating
    })
}
if (typeof module != 'undefined' && module.exports) module.exports = Tableau
