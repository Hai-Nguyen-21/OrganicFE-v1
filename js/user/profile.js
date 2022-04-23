app.controller('profileController', function($rootScope, $scope, $http){
    
    $scope.followOrder = function(){
        $http.get($rootScope.apiOrder + $rootScope.user.id).then(function (responese) {
            $scope.orderOfUser = responese.data;
            if(responese.data.status == 'Unresolved' || responese.data.status == 'Fail'){
                $scope.isHide = true;
            }
        })
    }

    $scope.sendData = function(id, status){
        $scope.totalCart = 0;
        $http.get($rootScope.apiOrderDetail + id).then(function(responese){
            $scope.detail = eval(responese.data);
            $scope.idOrder = id;
            $scope.statusOrder = status;
            for(let i = 0; responese.data.length; i++){
                $scope.totalCart += responese.data[i].total;
            }
        })
    }

    $scope.seen = function(id){
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Completion"
        })
        Swal.fire({
            icon: 'success',
            title: 'Cảm ơn bạn đã mua hàng',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }

    $scope.cancel = function(id){
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Fail"
        })
        Swal.fire({
            icon: 'success',
            title: 'Đơn hàng đã được hủy',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }

    $scope.reBuy = function(id){
        $http.put($rootScope.apiOrder + 'update', {
            "id": id,
            "status": "Processing"
        })
        Swal.fire({
            icon: 'success',
            title: 'Đơn hàng đã được gửi đi',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
    }

    $scope.edit = false;
    $scope.isToggle = function(){
        $scope.edit = !$scope.edit;
    }

    $scope.edit_id = $rootScope.user.id;
    $scope.edit_username = $rootScope.user.username;
    $scope.edit_fullname = $rootScope.user.fullname;
    $scope.edit_phone = $rootScope.user.phone;
    $scope.edit_address = $rootScope.user.address;
    $scope.edit_password = $rootScope.user.password;
    $scope.new_password;

    $scope.updateProfile = function(status, id){
        if(status == true){
            $http.put($rootScope.apiUser + id, {
                "id": id,
                "username": $scope.edit_username,
                "fullname": $scope.edit_fullname,
                "password": $scope.edit_password,
                "phone": $scope.edit_phone,
                "address": $scope.edit_address,
            })
            Swal.fire({
                icon: 'success',
                title: 'Sửa tài khoản thành công!',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
        } else {
            if($scope.new_password == $scope.edit_password){
                Swal.fire({
                    icon: 'warning',
                    title: 'Mật khẩu cũ trùng mật khẩu mới!',
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                });
            } else {
                $http.put($rootScope.apiUser + id, {
                    "id": id,
                    "password": $scope.new_password,
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công!',
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                });
            }
        }
    }

})