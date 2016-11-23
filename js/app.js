angular.module('photoApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url : '/',
                templateUrl : 'index.html',
                controller : function($state,$scope){
                    $scope.stateHolder = $state.current.name;
                }
            })
            .state('gallery', {
                url : '/gallery',
                templateUrl : 'templates/gallery.html',
                controller : 'PhotoAppController'
            })
            .state('gallery.detail', {
                url : '/detail/{image_id:int}',
                templateUrl : 'templates/gallery_detail.html',
                controller : 'PhotoDetailController'
            });

    }])
    .service('fetchImageService',['$http', function($http){
        this.getImages = function(){
            var images = [],
                x = 0,
                patt = /jpg|png$/;
            /*
                1. check whether images are already fetched or not
                2. send an http request to fetch the image data
                3. iterate through the response and 'filter'(using Regex) images whose urls are broken 
            */
            if(!images.length){
                $http.get('https://www.reddit.com/r/pics/.json?jsonp=').then(function(res) {
                    angular.forEach(res.data.data.children, function(item) {
                        images.push({
                            url: item.data.url.match(patt) ? item.data.url : null,
                            title: item.data.title,
                            author: item.data.author,
                            id: x++
                        });
                    });

                }, function(err) {
                    console.log(err);
                });
            }
            return images;            
        };
    }])
    .factory('selectedImageService', function(){
        var selectedImage = {};

        setData = function(img){
            selectedImage = img;
        };

        return {
            getData : function(){
                return selectedImage;
            },
            setData : setData
        };
    })
    .controller('PhotoAppController', ['$scope', 'orderByFilter', 'fetchImageService', '$state', 'selectedImageService', function($scope, $orderBy, fetchImageService, $state, selectedImageService) {

        /*
            1. Initialize images array 
            2. initialize sortFactor
        */

        $scope.images = [];
        $scope.sortFactor = null;
        $scope.stateHolder = $state.current;

        $scope.start = function() {
            /*
                1. Toggle fetchPhotosBtnClicked
            */
            $scope.fetchPhotosBtnClicked = !$scope.fetchPhotosBtnClicked;
            $scope.images = fetchImageService.getImages();
            console.log($state.current)
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

        $scope.setSelectedImage = function(img){
            selectedImageService.setData(img);
        };

    }])
    .controller('PhotoDetailController', ['selectedImageService', '$scope', function(selectedImageService, $scope){
        $scope.image = selectedImageService.getData();
    }]);