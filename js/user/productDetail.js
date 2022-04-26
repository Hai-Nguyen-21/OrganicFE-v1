app.controller('productDetailUserController', function($rootScope, $scope, $http, $routeParams){
    $scope.id_product = 0;
    $scope.btnLike = false;
    $scope.indexProductInCart = -1;

    $http.get($rootScope.apiOrderDetail + $rootScope.cart.id).then(function (responese) {
        $scope.cartProduct = eval(responese.data);
    })

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

    $scope.addToCartInDetail = function(id){
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
            for(let i = 0; i < $scope.cartProduct.length; i++){
                if($scope.cartProduct[i].idProduct == id){
                    $scope.indexProductInCart = i;
                } else {
                    $scope.indexProductInCart = -1;
                }
            }
            if (Number($scope.indexProductInCart) >= 0) {
                console.log($scope.cartProduct[$scope.indexProductInCart]);
                // var quantity = Number($scope.value) + Number($scope.cartProduct[$scope.indexProductInCart].quantity);
                $http.put($rootScope.apiOrderDetail + id, {
                    "id": $scope.cartProduct[$scope.indexProductInCart].id,
                    "idOrder": $scope.cartProduct[$scope.indexProductInCart].idỎder,
                    "idProduct": $scope.cartProduct[$scope.indexProductInCart].id,
                    "nameProduct": $scope.cartProduct[$scope.indexProductInCart].nameProduct,
                    "imageProduct": $scope.cartProduct[$scope.indexProductInCart].imageProduct,
                    "price": $scope.cartProduct[$scope.indexProductInCart].price,
                    "quantity": Number($scope.value) + Number($scope.cartProduct[$scope.indexProductInCart].quantity),
                    "total": Number($scope.product.price) * (Number($scope.value) + Number($scope.cartProduct[$scope.indexProductInCart].quantity))
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