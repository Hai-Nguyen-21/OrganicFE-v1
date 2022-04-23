app.controller("newProductController", function($rootScope, $scope, $http){
    $scope.name;
    $scope.price;
    $scope.quantity;
    $scope.weight;
    $scope.status = 1;
    $scope.category;
    $scope.description;
    $scope.image;

    $scope.save = function(){
        $http.post($rootScope.apiProduct, {
            "name": $scope.name,
            "image": $scope.image,
            "price": $scope.price,
            "description": $scope.description,
            "quantity": $scope.quantity,
            "weight": $scope.weight,
            "status": $scope.status == 1 ? true : false,
            "idCate": $scope.category
        })
        Swal.fire({
            icon: 'success',
            title: 'Thêm sản phẩm thành công!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
        window.location.href = '#!admin/home';
    }
})