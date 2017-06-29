angular
    .module('photoCollageModule', [])
    .controller('photoCollageCtrl', function ($scope, $http) {

        $http.get('/../bin/myjsonfile.json')
            .then(function(data){
                $scope = JSON.parse(data)
            })

        var imgSource = $scope

//define the image source(s)

        loadCollagePhotos(); //load the collage photos on Page Load

        function loadCollagePhotos() {
            for (i = 0; i < imgSource.length; i++) {
                if (i < 10) {
                    addPhotos(imgSource[i], (300 * i), 0, 300, 300);
                } else if (i < 20) {
                    addPhotos(imgSource[i], (300 * (i%10)), 300, 300, 300)
                } else if (i < 30) {
                    addPhotos(imgSource[i], (300 * (i%10)), 600, 300, 300)
                } else if (i < 40) {
                    addPhotos(imgSource[i], (300 * (i%10)), 900, 300, 300)
                } else if (i < 50) {
                    addPhotos(imgSource[i], (300 * (i%10)), 1200, 300, 300)
                }
            }
        };

        //this function draws images on the canvas.
        function addPhotos(imgSrc,x,y,width,height) {

            var canvas = document.getElementById("cnvPhoto"); //get the canvas element

            var context = canvas.getContext("2d"); //create a two-dimensional rendering context.

            var img = new Image();//create HTMLImageElement instance
            img.src = imgSrc;

            context.translate(x + width / 2, y + height / 2); //translates the canvas coordinate system

            context.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height); //draws the image onto the canvas

            context.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
        }

    }); //end of controller