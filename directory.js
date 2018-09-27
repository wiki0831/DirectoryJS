var sortedJSON, filteredJSON, filter, filterDept;
filter = "";
filterDept = "All Departments";
var apiBaseURL = "https://api.pamplin.vt.edu/";
//var apiEndpointPath = "edid/people.ashx";
var apiEndpointPath = "v1/persons/directory?kind=pamplin";

// if ($('body').is('.directory')) {
    var body = document.getElementsByClassName('vt-bodycol-content');
    loadJSON();
    filterJSON();
    buildHTML();
    console.log(5 + 6);

// }

function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
    {
        return True;
    }
    else  // If another browser, return 0
    {
        return False;
    }
}


function loadJSON() {
    var request = new XMLHttpRequest();
    request.open("GET", apiBaseURL + apiEndpointPath, false);
    request.send(null);
    var dirJSON = JSON.parse(request.responseText);

    sortedJSON = dirJSON.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
        return b.sn < a.sn || (b.sn == a.sn && b.givenName < a.givenName) ? 1 // if b should come earlier, push a to end
            : b.sn > a.sn || (b.sn == a.sn && b.givenName > a.givenName) ? -1 // if b should come later, push a to begin
                : 0;                   // a and b are equal
    });
}

function filterJSON() {

    fitlered = sortedJSON;

    if (filter.length > 0 && filterDept == 'All Departments') {
        
        
        filtered = sortedJSON.filter(function (n) { return n.displayName.toLowerCase().indexOf(filter) !== -1});

        // filtered = sortedJSON;
    }
    

    else if (filter.length > 0 && filterDept != 'All Departments') {
        
        filtered = sortedJSON.filter(function (n) { return n.displayName.toLowerCase().indexOf(filter) !== -1 && n.department === filterDept; });
    }

    else if (filterDept != 'All Departments') {
        
        filtered = sortedJSON.filter(function (n) { return n.department === filterDept; });
    }
    else {
        
        filtered = sortedJSON;
    }

    
    filteredJSON = filtered;
}


/**
 * Builds a string containing the HTML that makes up the content of the directory listing.
 * 
 * @returns {string} The directory HTML string
 * 
 * */
function buildDirectory() {
    var htmlBody = "<h2>Results</h2><div class='equal-column-heights row'>"; 

    // Iterate through all items in the filtered JSON array, if available
    for (var i = 0; filteredJSON && Array.isArray(filteredJSON) && i < filteredJSON.length; i++) {
        var person = filteredJSON[i];

        // Extract the parts of a 10-digit telephone number, if available
        var phoneNumber = person.telephoneNumber ? person.telephoneNumber.match(/(\d{3})(\d{3})(\d{4})/) : null;
        
        if (phoneNumber !== null) {
            // Format the telephone number in a standard, human-readable format
            phoneNumber = "(" + phoneNumber[1] + ") " + phoneNumber[2] + "-" + phoneNumber[3]; 
        }

        // Check that, at a bare minimum, the person has a display name set (otherwise don't add them to the list...but this shouldn't ever happen)
        if (person.displayName && person.displayName.length > 0)
        {
            htmlBody += "<div class='col-md-5 directory-card' style=''><div class='directory-person'><p class='h3'>" + person.displayName +
                "</p>";
            // Add other properties for the person to the output, if they are set
            if (person.title && person.title.length > 0) {
                htmlBody += "<p class='title'>" + person.title + "</p>";
            }
            if (person.department && person.department.length > 0) {
                htmlBody += "<p class='department'>" + person.department + "</p>";
            }
            if (person.mailPreferredAddress && person.mailPreferredAddress.length > 0) {
                htmlBody += "<p><b>Email: </b><a href='mailto:" + person.mailPreferredAddress + "'>" + person.mailPreferredAddress + "</a></p>";
            }
            if (phoneNumber && phoneNumber.length > 0) {
                htmlBody += "<p><b>Phone: </b>" + phoneNumber + "</p>";
            }
            if (person.postalAddress && person.postalAddress.length > 0) {
                // Office postal addresses come delimited by the '$' character, so split each up into individual lines in the HTML
                htmlBody += "<p><b>Office: </b>" + person.postalAddress.replace(/\$/g, "<br>") + "</p>";
            }
            htmlBody += "</div></div>";
        }
        
        if (i % 2 === 1)
        {
            // Add a clearfix DIV after every 2nd entry to have, at most, two entries per row in the results
            htmlBody += "<div class='clearfix hidden-sm hidden-xs'></div>";
        }
    }

    htmlBody += "</div>"
    return htmlBody;
}



function buildFilters() {
    var htmlheader = "";
    var depts = ['All Departments', 'Accounting & Information Systems', 'Business Information Technology', 'Finance, Insurance & Business Law', 'Hospitality and Tourism', 'Management', 'Marketing', 'Dean of Business', 'Executive MBA Program', 'Undergraduate Advising', 'Masters of Information Technology', 'PMBA Program', 'MBA Program', 'International Programs', 'Ctr for Innov & Entrepreneurship','Ctr for Busi Intelligence&Analytics','Executive Business Research'];

    var filtersDiv = document.createElement("div");
    htmlheader += "<div id='filters' class='parbase section list'> <h2>Filters</h2> <input class='form-control  input-lg' type='text' id='myInput' value='" + filter +"' onkeyup='myFunction();' placeholder='Search for name...' />";
    htmlheader += "<br/><select class='form-control  input-lg' id='deptfilter' name='dept' onchange='myFunction();'>";

    for (var i = 0, len = depts.length; i < len; ++i) {
        htmlheader += "<option value='" + depts[i] + "'>" + depts[i] + "</option>";

    }

      
    htmlheader += "</select > ";

    htmlheader += "</div>";
        return htmlheader;
}


function myFunction() {
    // Declare variables
    
    var input
    input = document.getElementById('myInput');
    dept = document.getElementById('deptfilter');
    filter = input.value.toLowerCase();
    filterDept = dept.value;
    filterJSON();
    reBuildDirectory();
   
}

function buildHTML() {
    console.log(5 + 6);
    var directoryTable = document.createElement("div"); 
    body[0].innerHTML = "";
    body[0].innerHTML += "<div class='alert alert-warning'><h1>THIS IS A TEST DIRECTORY<h1><p>This is just a test page</p></div>"

    body[0].innerHTML += buildFilters();

    body[0].innerHTML += "<div id='directorytable' class='parbase section list'>"

    body[0].innerHTML += "</div>";

    reBuildDirectory();
}

function reBuildDirectory()
{
    var directory = document.getElementById('directorytable');
    directory.innerHTML = "";
    directory.innerHTML = buildDirectory();
}



