var FPApp = angular.module("FPApp", ["ionic"]);

FPApp.service("FPSvc", ["$http", "$rootScope", FPSvc]);

FPApp.controller("FPCtrl",
    [
        "$scope",
        "$sce",
        "$ionicLoading",
        "$ionicListDelegate",
        "FPSvc", FPCtrl]);

function FPCtrl($scope, $sce, $ionicLoading, $ionicListDelegate, FPSvc) {

    //While making the http get call from service, users see this
    $ionicLoading.show({template: "Loading Blogs"});

    $scope.blogs =[];

    $scope.params={};

    //Listens to the service broadcast, the first argument in function is blank because
    //we are not interested in it
    $scope.$on("FPApp.blogs", function(_, result){
        //For each item in the JSON that is returned, loop through it and get
        //certain properties
        //sce fixes escaped characters that occur as html
        result.posts.forEach(function(b){
            $scope.blogs.push({
                name: b.author.name,
                avatar_URL: b.author.avatar_URL,
                title: $sce.trustAsHtml(b.title),
                URL: b.URL,
                excerpt: $sce.trustAsHtml(b.excerpt),
                featured_image: b.featured_image
            });
        });

        $scope.params.before = result.date_range.oldest;

        //Stop the spinning animation
        $scope.$broadcast("scroll.infiniteScrollComplete");
        $scope.$broadcast("scroll.refreshComplete");

        $ionicLoading.hide();
    });

    $scope.loadMore= function () {
        FPSvc.loadBlogs($scope.params);
    }

    $scope.reload = function() {
        $scope.blogs=[];
        $scope.params={};
        FPSvc.loadBlogs();
    }

    $scope.show = function($index) {
        console.log("show " +  $scope.blogs[$index].URL);
    }

    $scope.share = function($index) {
        $ionicListDelegate.closeOptionButtons();
        console.log("show " +  $scope.blogs[$index].URL);
    }


}

function FPSvc($http, $rootScope) {
    this.loadBlogs = function(params) {
        $http.get("https://public-api.wordpress.com/rest/v1/freshly-pressed/", {params:params})
            .success(function(result) {
                $rootScope.$broadcast("FPApp.blogs", result);

            });
    };
}
