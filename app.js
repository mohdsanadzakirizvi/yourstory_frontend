angular.module('photoApp', [])
    .controller('PhotoAppController', ['$http', '$scope', 'orderByFilter',function($http, $scope, $orderBy) {

        /*
            1. Initialize images array 
            2. initialize sortFactor
        */

        $scope.images = [];
        $scope.sortFactor = null;

        $scope.start = function() {
            /*
                1. Toggle fetchPhotosBtnClicked
                2. send an http request to fetch the image data
                3. iterate through the response and 'filter'(using Regex) images whose urls are broken 
                4. push the newly formed image data to the images array
            */
            $scope.fetchPhotosBtnClicked = !$scope.fetchPhotosBtnClicked;

            $http.get('https://www.reddit.com/r/pics/.json?jsonp=').then(function(res) {
                
                angular.forEach(res.data.data.children, function(item) {
                    var patt = /jpg|png$/;
                    $scope.images.push({
                        url: item.data.url.match(patt) ? item.data.url : null,
                        title: item.data.title,
                        author: item.data.author
                    });
                });

            }, function(err) {
                console.log(err);
            });

        };

        $scope.sortBy = function(type){
            /*
                1. Toggle sortBtnClicked
                2. Update the sortFactor 
                3. Refresh the array order by calling $orderBy on array
            */
            $scope.sortBtnClicked = !$scope.sortBtnClicked;
            $scope.sortFactor = type;
            $scope.images = $orderBy($scope.images, $scope.sortFactor);
        };

    }]);