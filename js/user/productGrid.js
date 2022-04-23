app.controller('productGridController', function($rootScope, $scope, $http, $routeParams){
    $scope.productByCate = [];
    $rootScope.categories.forEach(cate => {
        if(cate.id == $routeParams.id){
            $scope.category = angular.copy(cate);
            $http.get($rootScope.apiProduct + 'cateid/' + $scope.category.id).then(function(responese){
                $scope.productByCate = eval(responese.data);
            })
            return;
        }
    });

    if($scope.productByCate == null){
        $rootScope.isVisible = true;
    }

    // $scope.count = 0;
    // $scope.pageCount = Math.ceil(sum / 9);
    // $scope.prev = function(){
    //     if($scope.count > 0){
    //         $scope.count -= 9;
    //     }
    // }
    // $scope.next = function(){
    //     if($scope.count < ($scope.pageCount - 1) * 9){
    //         $scope.count += 9;
    //     }
    // }
})