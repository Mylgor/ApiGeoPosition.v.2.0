ymaps.ready(init);
var myMap;
var messageBox = document.getElementById('message');

function init(){     
    myMap = new ymaps.Map("map", {
        center: [56.64, 47.9],
        zoom: 10
    });
    getAllItem();
}

function addNewMark(latitude, longitude, hintCont){
    var lat = parseFloat(latitude);
    var long = parseFloat(longitude);
    if (isNaN(lat) || isNaN(long)){
        alert("Неверные координаты");
        return;
    }
    
    if (!isExistMark([lat, long])){
        var myPlaceMark = new ymaps.Placemark([lat, long], {
            hintContent: hintCont,
        });

        myMap.geoObjects.add(myPlaceMark); 
        myMap.setCenter([lat,long]);

        addMarkInList(latitude, longitude, hintCont);

        addItem(latitude, longitude, hintCont);

        messageBox.innerHTML = "Метка добавлена";
    }else{
        messageBox.innerHTML = "Метка уже существует";
    }
}

function deleteAllMarks(){
    myMap.geoObjects.removeAll();
    clearList();
    clearLocalStorage();
    messageBox.innerHTML = "Все метки удалены"; 
}

function isExistMark(coord){
    
    var isFind = false;
    myMap.geoObjects.each(function (geoObject) {
        
        var position = geoObject.geometry.getBounds()[0];
        if (position[0] == coord[0] && position[1] == coord[1]){
            isFind = true;
        }
    }.bind(this));
    
    return isFind;
}

function getMyLocation(){
    if (window.navigator.geolocation){
        
        navigator.geolocation.getCurrentPosition(
        function(position) {
            if (!isExistMark([position.coords.latitude, position.coords.longitude]))
                addNewMark(position.coords.latitude, position.coords.longitude, "Мое меcтоположение")
        },
        function(e) {
            switch (e.code) {
                case e.PERMISSION_DENIED:
                    alert("Permission denied");
                    break;
                case e.POSITION_UNAVAILABLE:
                    alert("Position unavaliable");
                    break;
                case e.TIMEOUT:
                    alert("The application has timed out");
                    break;
                default:
                    alert("There was a horrible Geolocation");
            }
        },
        { 
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        }
    );
    } else{
        alert("Браузер не поддерживает геолокацию");
    }
}

function deleteMark(mark){
    var coord = getCoodinage(mark, mark.parentElement);
    
    var isFind = myMap.geoObjects.each(function (geoObject) {
        var position = geoObject.geometry.getBounds()[0];
        if (position[0] == coord[0] && position[1] == coord[1]){
            myMap.geoObjects.remove(geoObject);
            
            deleteItem(geoObject.properties.get('hintContent'));
            return true;
        }
    }.bind(this));
    
    
    if (isFind != true){
        mark.parentElement.remove();
        messageBox.innerHTML = "Метка удалена";  
    }else{
        messageBox.innerHTML = "Ошибка удаления";    
    }
}

function setVisible(mark){
    var coord = getCoodinage(mark, mark.parentElement);
    
    var isFind = myMap.geoObjects.each(function (geoObject) {
        var position = geoObject.geometry.getBounds()[0];
        
        if (position[0] == coord[0] && position[1] == coord[1]){
            if (mark.value == "Скрыть"){
                geoObject.options.set('visible', false);
            }
            else if (mark.value == "Восстановить"){
                geoObject.options.set('visible', true);
                myMap.setCenter([coord[0], coord[1]]);
            }
            
            return true;
        }
    }.bind(this));
    
    if (isFind){
        if (mark.value == "Скрыть"){
            mark.value = "Восстановить";
            messageBox.innerHTML = "Метка скрыта";      
        }
        else if (mark.value == "Восстановить"){
            mark.value = "Скрыть";
            messageBox.innerHTML = "Метка восстановленна";      
        }
    }else{
        messageBox.innerHTML = "Метка не найдена";  
    }
}

function showMark(mark){
    var coord = getCoodinage(mark, mark.parentElement);
    
    myMap.geoObjects.each(function (geoObject) {
        var position = geoObject.geometry.getBounds()[0];
        if (position[0] == coord[0] && position[1] == coord[1]){
            myMap.setCenter([coord[0], coord[1]]);
        }
    }.bind(this));
}

function changeNameMark(mark, newName){
    var coord = getCoodinage(mark, mark.parentElement.parentElement);
    
    myMap.geoObjects.each(function (geoObject) {
        var position = geoObject.geometry.getBounds()[0];
        if (position[0] == coord[0] && position[1] == coord[1]){
            geoObject.properties.set('hintContent', newName);
            messageBox.innerHTML = "Название метки изменено";
        }
    }.bind(this));
}

function showAllMarksInRadius(){
    
    var radius = document.getElementById('txtRadius').value;
    radius = getNumFromNode(radius);
    if (radius != null){
        navigator.geolocation.getCurrentPosition(
            function(myPos) {
                //круг
                var circleGeometry = new ymaps.geometry.Circle([myPos.coords.latitude, myPos.coords.longitude], radius),
                    circleGeoObject = new ymaps.GeoObject({ geometry: circleGeometry });    
                    
                    myMap.geoObjects.add(circleGeoObject);
                    getMyLocation();
                
                    myMap.geoObjects.each(function (geoObject) {
                        var position = geoObject.geometry.getBounds()[0];
                        
                        if (!circleGeometry.contains([position[0], position[1]]) && geoObject.geometry.getType() != "Circle"){
                            geoObject.options.set('visible', false);
                            hideElemList([position[0], position[1]]);
                        }
                    }.bind(this));
            });
        
    }else{
        messageBox.innerHTML = "Введите число";
    }
}

function deleteRadius(){
   myMap.geoObjects.each(function (geoObject) {
        var type = geoObject.geometry.getType();
        if (type == "Circle"){
            myMap.geoObjects.remove(geoObject);
        }
       
    }.bind(this));
}







