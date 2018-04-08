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
