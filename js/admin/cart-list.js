app.controller('cartListController', function($scope, $rootScope, $http){
    $http.get($rootScope.apiOrder + 'processing').then(function(responese){
        $scope.list_order = eval(responese.data);
    })
    $scope.isIoggle = false;
    $scope.isComplation = false;
    $scope.title = "Đơn hàng mới";

    $scope.getProcessing = function(){
        $http.get($rootScope.apiOrder + 'processing').then(function(responese){
            $scope.list_order = eval(responese.data);
        })
        $scope.isIoggle = false;
        $scope.isComplation = false;
        $scope.title = "Đơn hàng mới";
    }

    $scope.getProcessed = function(){
        $http.get($rootScope.apiOrder + 'processed').then(function (responese) {
            $scope.list_order = eval(responese.data)
        })
        $scope.showInfo = false;
        $scope.isIoggle = true;
        $scope.isComplation = false;
        $scope.title = "Soạn hàng xong";
    }
    
    $scope.getShip = function(){
        $http.get($rootScope.apiOrder + 'shipping').then(function(responese){
            $scope.list_order = eval(responese.data);
        })
        $scope.showInfo = false;
        $scope.isIoggle = false;
        $scope.isComplation = true;
        $scope.title = "Đang vận chuyển";
    }
    
    $scope.getCompletion = function(){
        $http.get($rootScope.apiOrder + 'completion').then(function(responese){
            $scope.list_order = eval(responese.data);
        })
        $scope.showInfo = false;
        $scope.isIoggle = false;
        $scope.isComplation = true;
        $scope.title = "Giao hàng thành công";
    }
    
    $scope.getFail = function(){
       $http.get($rootScope.apiOrder + 'fail').then(function(responese){
            $scope.list_order = eval(responese.data);
        }) 
        $scope.showInfo = false;
        $scope.isComplation = false;
        $scope.title = "Giao thất bại";
    }
    
    $scope.showInfo = false;
    $scope.sendData = function(id, id_user){
        $scope.totalCart = 0;
        $http.get($rootScope.apiOrderDetail + id).then(function(responese){
            $scope.processings = eval(responese.data);
            $scope.idOrder = responese.data[0].idOrder;
            for(let i = 0; responese.data.length; i++){
                $scope.totalCart += responese.data[i].total;
            }
        })
        $http.get($rootScope.apiUser + id_user).then(function(responese){
            $scope.chooseUser = eval(responese.data);
        })
        $scope.showInfo = true;
    }

    $scope.updateOrderToProcessed = function(id){
        console.log(id);
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Processed"
        })
        Swal.fire({
            icon: 'success',
            title: 'Đơn hàng chuẩn bị được giao!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }

    $scope.updateOrderToShip = function(id){
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Shipping"
        })
        Swal.fire({
            icon: 'success',
            title: 'Đơn hàng đang được vận chuyển',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }

    $scope.updateOrderToFail = function(id){
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Fail"
        })
        Swal.fire({
            icon: 'success',
            title: 'Đơn hàng đã bị hủy',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }
})