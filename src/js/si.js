var siApp = angular.module('siApp',['hc.marked','ngRoute']);
var siApiURL = '//138.68.253.109/'
var siApiContent = siApiURL + 'inktankcontent/index.json';
var siApiBlog    = siApiURL + 'inktankblog/index.json';

siApp.config(function($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
          templateUrl : 'views/home.html'
      })
      .when('/blog/', {
          templateUrl : 'views/blog.html'
      })
      .when('/blog/:date/', {
          templateUrl : 'views/entry.html',
          controller : 'blogsController'
      })
      .when('/speakeasy/', {
          templateUrl : 'views/speakeasy.html'
      })
      .when('/speakeasy/artists/', {
          templateUrl : 'views/speakeasy_artists.html'
      })
      .when('/speakeasy/faq/', {
          templateUrl : 'views/speakeasy_faq.html'
      })
      ;
    $locationProvider.hashPrefix('');
});


siApp.controller('siInit', ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
  $scope.blogs = {};

  // get the site content
  $http({
    method: 'GET',
    url: siApiContent
  }).then(function successCallback(response) {
    var dataObj = response.data['Website Content'];
    $scope.home = _.find(dataObj, ['Name', 'Home']);
    $scope.speakeasy = _.find(dataObj, ['Name', 'Speakeasy']);
    console.log($scope.speakeasy);
    $scope.speakeasy_faq = _.find(dataObj, ['Name', 'Speakeasy FAQ']);
    $scope.speakeasy_artists = _.find(dataObj, ['Name', 'Speakeasy Artists']);
  }, function errorCallback(response) {
      console.log('API Error!');
  });

  // get the blog entries
  $http({
    method: 'GET',
    url: siApiBlog
  }).then(function successCallback(response) {
    $scope.blogs = {};
    _.each(response.data['Blog Content'], function(value){
      $scope.blogs[value['Post Date']] = value;
    });
  }, function errorCallback(response) {
      console.log('API Error!');
  });
}])
.controller('blogsController', ['$scope','$routeParams', 
  function($scope,$routeParams) {
    // set the displayed blog article
    $scope.$watch('blogs', function(){
      $scope.blog = $scope.blogs[$routeParams.date];
    });
}])
.directive('entryList', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/entry-list.html'
  };
})
// template for blog nav
.directive('speakeasyNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/speakeasy_nav.html'
  };
});
