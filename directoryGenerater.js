// This javascript file extract data from xml and inject the data into html.
// author: weiqi yuan
// version: 2018.09.24
// bib: wiki0831.com

//build_directory send xhttp request and retrive the xml as a local data
function build_directory() {
    //get departement code from class named directoryGenerater
    var department_code = document.getElementsByClassName('directoryGenerater')[0].getAttribute("value");
    var xml = 'https://webapps.middleware.vt.edu/peoplesearch/Search?query=(departmentNumber%' + department_code + ')';

    //sending the request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            polulate_card(this);
        }
    };

    xhttp.open("GET", xml, true);
    xhttp.send();
}

//polulate_card build directory name card with title, email, phone# and ... 
//namecard will be appended to the class 'directoryGenerater'
function polulate_card(xml) {

    //setting up variable
    var i;
    var xmlDoc = xml.responseXML;
    var peopleDirectory = xmlDoc.getElementsByTagName("dsml:entry"); //people from the department

    //looping through all the person in the current xml
    for (i = 0; i < peopleDirectory.length; i++) {

        //locate each peoson and retrieve all their attributes
        var j;
        people = peopleDirectory[i];
        attrs = people.getElementsByTagName("dsml:attr");

        //Initializing html elements
        var displayName = document.createElement('displayName');
        var perosontitle = document.createElement('perosontitle');
        var department = document.createElement('department');
        var mail = document.createElement('mail');
        var telephoneNumber = document.createElement('telephoneNumber');
        var postalAddress = document.createElement('postalAddress');

        //getting title, name, phone number by attribute name.
        for (j = 0; j < attrs.length; j++) {
            if (attrs[j].getAttribute('name') == 'mail') {
                mail.innerHTML = "Email: " + attrs[j].getElementsByTagName("dsml:value")[0].innerHTML + "<br>";
            }
            if (attrs[j].getAttribute('name') == 'title') {
                perosontitle.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML + "<br>";
            }
            if (attrs[j].getAttribute('name') == 'department') {
                department.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML + "<br>";
            }
            if (attrs[j].getAttribute('name') == 'displayName') {
                displayName.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML + "<br>";
            }
            if (attrs[j].getAttribute('name') == 'telephoneNumber') {
                telephoneNumber.innerHTML = "Phone: " + attrs[j].getElementsByTagName("dsml:value")[0].innerHTML + "<br>";
            }
            if (attrs[j].getAttribute('name') == 'postalAddress') {
                postalAddress.innerHTML = "Postal Address: <br>" + attrs[j].getElementsByTagName("dsml:value")[0].innerHTML.replace(/[$,]+/g, "<br />");
            }
        }

        //append the corresspondig value to the name card
        var name_card = document.createElement('div');
        name_card.className = "directory-card";
        name_card.appendChild(displayName);
        name_card.appendChild(perosontitle);
        name_card.appendChild(department);
        name_card.appendChild(mail);
        name_card.appendChild(telephoneNumber);
        name_card.appendChild(postalAddress);

        //append the namecard to the div with proper ID 
        document.getElementsByClassName('directoryGenerater')[0].appendChild(name_card);
    }
}