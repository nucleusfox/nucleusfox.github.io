function openAbout(evt, tabAbout) {
    var i, tablinks;
    var x = document.getElementsByClassName("tab_about");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }


    tablinks = document.getElementsByClassName("tab_bar_button");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tab_bar_button_active", "");
    }

    document.getElementById(tabAbout).style.display = "block";

    evt.currentTarget.className += " tab_bar_button_active";
}


function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

function moveToSection(sectionId) {
    document.getElementById(sectionId).focus();
}


/* Draggable menu */
dragElement(document.getElementById("dragon_menu_bar"));

function dragElement(el) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("dragon_menu")) {
        document.getElementById("dragon_menu").onmousedown = dragMouseDown;
    } else {
        el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}