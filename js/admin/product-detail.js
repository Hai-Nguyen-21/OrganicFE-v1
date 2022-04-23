app.controller('productDetailController', function ($rootScope, $scope, $http, $routeParams) {
    $http.get($rootScope.apiProduct + $routeParams.id).then(function (responese) {
        $scope.product = eval(responese.data);

        $scope.id = $scope.product.id;
        $scope.edit_name = $scope.product.name;
        $scope.edit_price = $scope.product.price;
        $scope.edit_quantity = $scope.product.quantity;
        $scope.edit_weight = $scope.product.weight;
        $scope.edit_status = $scope.product.status;
        $scope.edit_cate = $scope.product.idCate;
        $scope.edit_description = $scope.product.description;
        $scope.edit_image = $scope.product.image;
    })

    $scope.update = function () {
        $http.put($rootScope.apiProduct, {
            "id": $scope.id,
            "name": $scope.edit_name,
            "image": $scope.edit_image,
            "price": $scope.edit_price,
            "description": $scope.edit_description,
            "quantity": $scope.edit_quantity,
            "weight": $scope.edit_weight,
            "status": $scope.edit_status,
            "idCate": $scope.edit_cate
        })
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật sản phẩm thành công!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
        window.location.href = '#!admin/home';
    }

    $scope.toggleEdit = true;

    $scope.toggle = function () {
        $scope.toggleEdit = !$scope.toggleEdit;
    }

})