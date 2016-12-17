function addItem(lat, long, name){
    localStorage.setItem(name, JSON.stringify({latitude: lat, longitude: long}));
}

function getAllItem(){
    var keys = Object.keys(localStorage);
    var i = keys.length;
    
    while (i--){
        var coord = JSON.parse(localStorage.getItem(keys[i]));
        addNewMark(coord.latitude, coord.longitude, keys[i]);
    }
}

function deleteItem(key){
    localStorage.removeItem(key);
}

function clearLocalStorage(){
    localStorage.clear();
}