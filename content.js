var ICON_URL    = chrome.extension.getURL("res/icon.png"),
    CARTA_PRE   = 'https://carta.stanford.edu/course/',
    CARTA_POST  = '/1174',
    result      = 1;

var generateButton = function(courseCode) {
    console.log('Generating button for course: ' + courseCode);
    return '<span class="etButton"><img id="etResult' + result + '" src="' + ICON_URL + '"></span>';
};

$('#searchResults').find('div').each(function() {
    if ($(this).attr('class') == 'searchResult' || $(this).attr('class') === 'searchResult-noBorder') {
        var courseInfo  = $(this).find('div').find('h2'),
            courseCode  = courseInfo.find('.courseNumber').html().slice(0, -1).replace(/\s+/g, ''),
            courseTitle = courseInfo.find('.courseTitle');

        courseTitle.after(generateButton(courseCode));
        $('#etResult' + (result++)).click(function() {
            window.open(CARTA_PRE + courseCode + CARTA_POST);
        });
    }
});