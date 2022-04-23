app.controller('productDetailUserController', function($rootScope, $scope, $http, $routeParams){
    $scope.id_product = 0;
    $scope.btnLike = false;

    $http.get($rootScope.apiProduct + $routeParams.id).then(function (responese) {
        $scope.product = eval(responese.data);
        $scope.id_product = responese.data.id;
        
        if ($rootScope.user != null) {
            $scope.index = -1;
            $http.get($rootScope.apiUserLike + $rootScope.user.id).then(function (responese) {
                $scope.listUserLiked = responese.data;
                // console.log($scope.product);
                // console.log(responese.data);
                for (let i = 0; i < responese.data.length; i++) {
                    // console.log($scope.product);
                    // console.log($scope.id_product, "=====", responese.data[i].idProduct);
                    if ($scope.id_product == responese.data[i].idProduct) {
                        $scope.index = i;
                        break;
                    } else {
                        $scope.index = -1;
                    }
                }
                if ($scope.index == -1) {
                    $scope.btnLike = false;
                } else {
                    $scope.btnLike = true;
                    // console.log($scope.listUserLiked[$scope.index]);
                }
            })
        }
    })
    
    $scope.value = 1;
    $scope.up = function(){
        $scope.value++;
    }
    $scope.down = function(){
        if($scope.value > 1){
            $scope.value--;
        } else {
            $scope.value = 1;
        }
    }

    $scope.addToCartInDetail = function(){
        if($rootScope.user == null){
            Swal.fire({
                title: 'Chưa đăng nhập!',
                text: 'Vui lòng đăng nhập trước khi mua hàng!',
                icon: 'info',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            })
        } else {
            if($rootScope.cartProduct[0].idProduct == $scope.product.id){
                var quantity = Number($scope.value) + Number($rootScope.cartProduct[0].quantity);
                $http.put($rootScope.apiOrderDetail + $rootScope.cartProduct[0].id, {
                    "id": $rootScope.cartProduct[0].id,
                    "idOrder": $rootScope.cart.id,
                    "idProduct": $scope.product.id,
                    "nameProduct": $scope.product.name,
                    "imageProduct": $scope.product.image,
                    "price": $scope.product.price,
                    "quantity": quantity,
                    "total": Number($scope.product.price) * quantity
                })
            } else {
                $http.post($rootScope.apiOrderDetail,{
                    "idOrder": $rootScope.cart.id,
                    "idProduct": $scope.product.id,
                    "nameProduct": $scope.product.name,
                    "imageProduct": $scope.product.image,
                    "price": $scope.product.price,
                    "quantity": $scope.value,
                    "total": Number($scope.product.price) * Number($scope.value)
                })
                let i = Number($rootScope.totalCart);
                i++;
                $rootScope.totalCart = i;
            }
            Swal.fire({
                title: 'Thêm thành công!',
                text: 'Thêm thành công 1 sản phẩm vào giỏ hàng, vui lòng kiểm tra giỏ!',
                icon: 'success',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 2000
            })
        }
    }

    $scope.addToLike = function(){
        if($rootScope.user == null){
            Swal.fire({
                title: 'Chưa đăng nhập!',
                text: 'Vui lòng đăng nhập trước khi đánh giá!',
                icon: 'info',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            })
        } else {
            if($scope.btnLike == false){
                $scope.btnLike = !$scope.btnLike;
                $http.post($rootScope.apiUserLike + 'add', {
                    "idUser": $rootScope.user.id,
                    "idProduct": $scope.product.id
                })
            } else {
                $scope.btnLike = !$scope.btnLike;
                $http.delete($rootScope.apiUserLike + $scope.listUserLiked[$scope.index].id);
            }
            
        }
    }
})