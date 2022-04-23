app.controller('homeAdminController', function($rootScope, $scope, $http){
    $http.get($rootScope.apiProduct).then(function(responese){
        $scope.products = eval(responese.data);
    })

    $scope.myCategory;
    $scope.getProductByCate = function(){
        $http.get($rootScope.apiProduct + "cateid/" + $scope.myCategory).then(function(responese){
            $scope.products = eval(responese.data);
        })
    }

})