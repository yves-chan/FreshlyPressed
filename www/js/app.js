var App = angular.module("App", ["ionic"]);

App.service("FreshlyPressed", ["$http", "$log", FreshlyPressed]);

App.controller("AppCtrl",["$scope", "FreshlyPressed", "$log", AppCtrl]);

function AppCtrl($scope, FreshlyPressed,  $log) {
    $scope.posts =[];

    $scope.refresh = function() {
        //alert("Button Pressed");
        FreshlyPressed.getBlogs($scope);
    }


}

function FreshlyPressed($http, $log) {
    this.getBlogs = function($scope) {
        $http.jsonp("https://public-api.wordpress.com/rest/v1/freshly-pressed?callback=JSON_CALLBACK")
            .success(function(result) {
                $scope.posts = result.posts;

                //Tell ionic the refresh is complete
                $scope.$broadcast("scroll.refreshComplete");

                //$log.info(JSON.stringify(result.posts));
            });
    };
}
