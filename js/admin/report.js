app.controller('reportController', function($http, $rootScope, $scope){
    
    $scope.totalMoney = 0;
    $http.get($rootScope.apiOrder + 'total-money').then(function(responese){
        $scope.totalMoney = responese.data;
    })

    $scope.totalOrderCompletion = 0;
    $http.get($rootScope.apiOrder + 'get-all').then(function(responese){
        for(let i = 0; i < responese.data.length; i++){
            if(responese.data[i].status == "Completion"){
                $scope.totalOrderCompletion++;
            }
        }
    })
})