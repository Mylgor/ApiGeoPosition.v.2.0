function clearList(){
    var list = document.getElementById("content");
    while (list.firstChild)
        list.removeChild(list.firstChild);
}

var oldVal, newVal, id;
function addMarkInList(latitude, longitude, hintCont){
    var $name = $("<p>", {id: "name"}).html($("<b>").html("Имя: ")).append($("<label>", {contenteditable: "true", class: "edit"}).html(hintCont));
    var $lat = $("<p>", {class: "latit"}).html($("<b>").html("Широта: ")).append(latitude);
    var $lot = $("<p>", {class: "longt"}).html($("<b>").html("Долгота: ")).append(longitude);
    var $btnDel = $("<input>", {type: "button", value: "Удалить", id: "btnDelete", onclick: "deleteMark(this)"});
    var $btnHide = $("<input>", {type: "button", value: "Скрыть", id: "btnHide", onclick: "setVisible(this)"});
    var $btnShow = $("<input>", {type: "button", value: "Показать", id: "btnShow", onclick: "showMark(this)"});
    
    var node = $("<li>").append($name, $lat, $lot, $btnDel, $btnHide, $btnShow).appendTo("#content");    
    
    node.find('label').focus(function(){
        oldVal = $(this).text();
    }).blur(function(){
        newVal = $(this).text();
        if (newVal != oldVal){
            changeNameMark(this, newVal);
        }
    });
}

function getNumFromNode(str){
    var numb = str.match(/\d+\.\d+/ig);
    if (numb != null)
        numb = numb.join("");
    else{
        numb = str.match(/\d+$/ig);
        if (numb != null)
            numb = numb.join("");
    }
    return numb;
}

$(document).ready(function(){
    $("#showForm").magnificPopup();
});


function getCoodinage(mark, parent){
    var allElemt = parent.getElementsByTagName("p");
    var lat = "";
    var long = "";
    
    allElemt = [].slice.call(allElemt);
    allElemt.forEach(function(item, i, allElemt){
       if (item.className == "latit"){
           lat = item.innerHTML;
       }else if (item.className == "longt"){
           long = item.innerHTML;
       }
    });
    
    return [getNumFromNode(lat), getNumFromNode(long)];
}

function hideElemList(coord){
    var ul = $('ul#content');
    var buttons = ul.find('input#btnHide');
    var latits = ul.find('.latit');
    var longtits = ul.find('.longt');
    
    for (var i = 0; i < buttons.length; i++){
        if (coord[0] == getNumFromNode(latits[i].innerHTML) && 
            coord[1] == getNumFromNode(longtits[i].innerHTML)){
            buttons[i].value = 'Восстановить';
            break;
        }
    }
}





