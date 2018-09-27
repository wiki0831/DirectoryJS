// This javascript file extract data from xml and inject the data into html.
// author: weiqi yuan
// version: 2018.09.24
// bib: wiki0831.com

//build_directory send xhttp request and retrive the xml as a local data
function build_directory(val) {
    //get departement code from class named directoryGenerater
    var xml = 'https://webapps.middleware.vt.edu/peoplesearch/Search?query=(departmentNumber%3d' + val + ')';

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
    var sn = new Array();

    //looping through all the person in the current xml
    for (i = 0; i < peopleDirectory.length; i++) {

        //locate each peoson and retrieve all their attributes
        var j;
        people = peopleDirectory[i];
        // console.log(people);


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
                mail.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML;
            }
            if (attrs[j].getAttribute('name') == 'title') {
                perosontitle.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML;
            }
            if (attrs[j].getAttribute('name') == 'department') {
                department.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML;
            }
            if (attrs[j].getAttribute('name') == 'displayName') {
                displayName.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML;
            }
            if (attrs[j].getAttribute('name') == 'telephoneNumber') {
                telephoneNumber.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML;
            }
            if (attrs[j].getAttribute('name') == 'postalAddress') {
                postalAddress.innerHTML = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML.replace(/[$,]+/g, "<br />");
            }
            if (attrs[j].getAttribute('name') == 'sn') {
                sn[i] = attrs[j].getElementsByTagName("dsml:value")[0].innerHTML.toUpperCase();
            }
        }

        //Mailto function
        var a = document.createElement('a');
        var linkText = document.createTextNode(mail.innerHTML);
        a.appendChild(linkText);
        a.href = "mailto:"+ mail.innerHTML;
        mail.appendChild(a);
        mail.innerHTML = "";

        //append the corresspondig value to the name card
        var name_card = document.createElement('div');
        name_card.className = "directory-card";
        name_card.setAttribute("data-sn", sn[i]);
        name_card.appendChild(displayName);
        name_card.appendChild(perosontitle);
        name_card.appendChild(department);
        name_card.appendChild(a);
        name_card.appendChild(telephoneNumber);
        name_card.appendChild(postalAddress);

        //append the namecard to the div with proper ID 
        document.getElementsByClassName('directoryGenerater')[0].appendChild(name_card);

        var $people = $('div.directoryGenerater'),
            $peopleli = $people.children('div');

        $peopleli.sort(function(a, b) {
            var an = a.getAttribute('data-sn'),
                bn = b.getAttribute('data-sn');

            if (an > bn) {
                return 1;
            }
            if (an < bn) {
                return -1;
            }
            return 0;
        });

        $peopleli.detach().appendTo($people);
    }
    console.log(sn)
}