angular.module('photoApp', [])
    .controller('PhotoAppController', ['$http', '$scope', function($http, $scope) {

        $scope.images = [];

        $scope.start = function() {
            $scope.clicked = !$scope.clicked;
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

    }]);