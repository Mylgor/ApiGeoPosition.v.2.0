'use strict';

class FileWorker{
    constructor(dz){
        this.dropzone = dz;

        this.dropzone.ondrop = function(e){
            e.preventDefault();
            this.className = 'dropzone';

            var reader = new FileReader();
            reader.onload = function(evt){
                this.setData(evt.target.result);
            };
            reader.readAsText(e.dataTransfer.files[0], "utf-8");

        };

        this.dropzone.ondragover = function(){
            this.className = 'dropzone dragover';
            return false;
        };

        this.dropzone.ondragleave = function(){
            this.className = 'dropzone';
            return false;
        }
    }

    setData(data){
        let json = JSON.parse(data);
        for (let i = 0; i < json.length; i++){
            addNewMark(json[i].coordinates.latitude, json[i].coordinates.longitude, json[i].name);
        }
    }

    getMarkFromForm(){
        var name = document.getElementById('txtNameMark').value;
        var lat = document.getElementById('txtLatMark').value;
        var lon = document.getElementById('txtLongMark').value;
        addNewMark(lat, lon, name);
    }
}

let dropzone = document.getElementById('dropzone');
let fileWorker = new FileWorker(dropzone);