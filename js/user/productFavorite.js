app.controller('productFavoriteController', function($scope, $rootScope, $http, $routeParams){
    $http.get($rootScope.apiFavorite + $rootScope.user.id).then(function(responese){
        $rootScope.productFav = eval(responese.data);
    })

    $scope.addToCart = function(id_product, id_fav){
        $http.get($rootScope.apiProduct + id_product).then(function(responese){
            $scope.fromDB = responese.data;
        })
        $http.get($rootScope.apiOrderDetail + $rootScope.cart.id).then(function(responese){
            $scope.orderItem = responese.data;
            var index = -1;
            for(let i = 0; i < responese.data.length; i++){
                if($scope.fromDB.id == responese.data[i].idProduct){
                    $scope.fromDB = responese.data[i];
                    console.log($scope.fromDB);
                    index = i;
                    break;
                } else {
                    index = -1;
                }
            }
            if(index != -1){
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Sản phẩm này đã có trong giỏ hàng, bạn có muốn thêm vào không?',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) =>{
                    if(result.value){
                        var quantity = responese.data[index].quantity;
                        $http.put($rootScope.apiOrderDetail + $scope.fromDB.id, {
                            "id": $scope.fromDB.id,
                            "idOrder": $rootScope.cart.id,
                            "idProduct": $scope.fromDB.idProduct,
                            "nameProduct": $scope.fromDB.nameProduct,
                            "imageProduct": $scope.fromDB.imageProduct,
                            "price": $scope.fromDB.price,
                            "quantity": Number(quantity) + 1,
                            "total": Number($scope.fromDB.price) * (Number(quantity) + 1)
                        })
                        Swal.fire({
                            title: 'Thêm thành công!',
                            text: 'Thêm thành công sản phẩm vào giỏ hàng!',
                            icon: 'success',
                            showConfirmButton: false,
                            closeOnClickOutside: false,
                            allowOutsideClick: false,
                            timer: 1600
                        })
                    } else {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: 'Sản phẩm này sẽ bị xóa khỏi mục yêu thích, bạn có muốn xóa không?',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No'
                        }).then((result) =>{
                            if(result.value){
                                $rootScope.productFav = $rootScope.productFav.filter((item)=>item.id !== id_fav);
                                $http.delete($rootScope.apiFavorite + id_fav);
                                let i = Number($rootScope.totalFav);
                                i--;
                                $rootScope.totalFav = i;
                                Swal.fire({
                                    title: 'Xóa thành công!',
                                    text: 'Xóa thành công 1 sản phẩm trong mục Yêu thích!',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    closeOnClickOutside: false,
                                    allowOutsideClick: false,
                                    timer: 1600
                                })
                            }
                        })
                    }
                })
            } else {
                // console.log($scope.fromDB);
                $http.post($rootScope.apiOrderDetail, {
                    "idOrder": $rootScope.cart.id,
                    "idProduct": id_product,
                    "nameProduct": $scope.fromDB.name,
                    "imageProduct": $scope.fromDB.image,
                    "price": $scope.fromDB.price,
                    "quantity": 1,
                    "total": $scope.fromDB.price
                })
                let i = Number($rootScope.totalCart);
                i++;
                $rootScope.totalCart = i;
                Swal.fire({
                    title: 'Thêm thành công!',
                    text: 'Thêm thành công sản phẩm vào giỏ hàng!',
                    icon: 'success',
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                })
            }
        })
        
    }

    $scope.remove = function(id_fav){
        Swal.fire({
            title: 'Are you sure?',
            text: 'Bạn có chắc muốn xóa sản phẩm này khỏi mục Yêu thích không?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) =>{
            if(result.value){
                $rootScope.productFav = $rootScope.productFav.filter((item)=>item.id !== id_fav);
                $http.delete($rootScope.apiFavorite + id_fav);
                let i = Number($rootScope.totalFav);
                i--;
                $rootScope.totalFav = i;
                Swal.fire({
                    title: 'Xóa thành công!',
                    text: 'Xóa thành công 1 sản phẩm trong mục Yêu thích!',
                    icon: 'success',
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                })
            }
        })
    }

})