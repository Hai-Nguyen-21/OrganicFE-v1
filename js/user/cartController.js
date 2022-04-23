app.controller('cartController', function($scope, $rootScope, $http, $routeParams){
    $scope.totalCartMoney = 0;
    $http.get($rootScope.apiOrderDetail + $routeParams.id).then(function(responese){
        $rootScope.cartProduct = eval(responese.data);
        // console.log(responese.data);
        for(let i = 0; responese.data.length; i++){
            $scope.totalCartMoney += responese.data[i].total;
        }
    })

    $scope.getData = function(id){
        $scope.idD = id;
    }

    $scope.removeItem = function(id) {
        $scope.cartProduct = $scope.cartProduct.filter((item)=>item.id !== id);
        $http.delete($rootScope.apiOrderDetail + id);
        let i = Number($rootScope.totalCart);
        i--;
        $rootScope.totalCart = i;
        Swal.fire({
            icon: 'success',
            title: 'Xóa sản phẩm thành công!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
        $http.get($rootScope.apiOrderDetail + "item/" +id).then(function(responese){
            $scope.totalCartMoney = Number($scope.totalCartMoney) - Number(responese.data.total);
        })
    }

    $scope.pay = function(){
        $http.put($rootScope.apiOrder + $routeParams.id);
        Swal.fire({
            icon: 'success',
            title: 'Thanh toán đơn hàng thành công, theo dõi đơn hàng nhé!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
        sessionStorage.removeItem('cart');
        $http.post($rootScope.apiOrder, {
            "id": $rootScope.user.id,
            "address": $rootScope.user.address
        })
        $http.get($rootScope.apiOrder + 'find-order/' + $rootScope.user.id).then(function(responese){
            $rootScope.cart = eval(responese.data);
            console.log(responese.data);
            sessionStorage.setItem('cart', angular.toJson($rootScope.cart));
        })
        $rootScope.totalCart = 0;
        // window.location.reload();
        window.location.href="#!home";
    }

})