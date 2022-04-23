app.controller('loginController', function($scope, $rootScope, $http) {
    $scope.login = function () {
        // var check = true;
        // $rootScope.listUser.forEach(user => {
        //     if (user.username == $scope.username_login && user.password == $scope.password_login) {
        //         if (user.role == true) {
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'Đăng nhập thành công!',
        //                 text: 'Quay lại trang chủ!',
        //                 showConfirmButton: false,
        //                 closeOnClickOutside: false,
        //                 allowOutsideClick: false,
        //                 timer: 1600
        //             });
        //             $rootScope.user = user;
        //             sessionStorage.setItem('login', angular.toJson(user));
        //             $rootScope.isUser = true;
        //             $rootScope.isAdmin = false;
        //             $rootScope.isToggleLogin = false;
        //             $rootScope.showCart = user.role;
        //             sessionStorage.setItem('showCart', user.role);
        //             check = false;
        //             for (let i = 0; i < user.orders.length; i++) {
        //                 if (user.orders[i].status == "Unresolved") {
        //                     $rootScope.cart = user.orders[i];
        //                     sessionStorage.setItem('cart', angular.toJson($rootScope.cart));
        //                 }
        //             }
        //         } else {
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'Đăng nhập thành công!',
        //                 showCancelButton: false,
        //                 confirmButtonColor: '#3085d6',
        //                 cancelButtonColor: '#d33',
        //                 confirmButtonText: 'Yes',
        //                 closeOnClickOutside: false,
        //                 allowOutsideClick: false,
        //                 timer: 1600
        //             }).then((result) => {
        //                 console.log(result);
        //                 if (result.value) {
        //                     $rootScope.user = user;
        //                     sessionStorage.setItem('login', angular.toJson(user));
        //                     $rootScope.isAdmin = true;
        //                     $rootScope.isUser = false
        //                     $rootScope.isToggleLogin = false;
        //                     $rootScope.showCart = user.role;
        //                     sessionStorage.setItem('showCart', user.role);
        //                     check = false;
        //                     window.location.href = "#!admin/home";
        //                 }
        //             })
        //         }
        //     }
        // })

        $http.post($rootScope.apiUser + 'login', {
            "username": $scope.username_login,
            "password": $scope.password_login
        }).then(function(responese){
            $rootScope.user = eval(responese.data);
            if($rootScope.user != null){
                if ($rootScope.user.role == true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công!',
                        text: 'Quay lại trang chủ!',
                        showConfirmButton: false,
                        closeOnClickOutside: false,
                        allowOutsideClick: false,
                        timer: 1600
                    }).then((result) =>{
                        if(result.value){
                            sessionStorage.setItem('login', angular.toJson($rootScope.user));
                            $rootScope.isUser = true;
                            $rootScope.isAdmin = false;
                            $rootScope.isToggleLogin = false;
                            $rootScope.showCart = $rootScope.user.role;
                            sessionStorage.setItem('showCart', $rootScope.user.role);
                            // check = false;
                            for (let i = 0; i < $rootScope.user.orders.length; i++) {
                                if ($rootScope.user.orders[i].status == "Unresolved") {
                                    $rootScope.cart = $rootScope.user.orders[i];
                                    sessionStorage.setItem('cart', angular.toJson($rootScope.cart));
                                }
                            }
                            window.location.href = "#!home";
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công!',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        closeOnClickOutside: false,
                        allowOutsideClick: false,
                        timer: 1600
                    }).then((result) => {
                        if (result.value) {
                            sessionStorage.setItem('login', angular.toJson($rootScope.user));
                            $rootScope.isAdmin = true;
                            $rootScope.isUser = false
                            $rootScope.isToggleLogin = false;
                            $rootScope.showCart = $rootScope.user.role;
                            sessionStorage.setItem('showCart', $rootScope.user.role);
                            // check = false;
                            window.location.href = "#!admin/home";
                        }
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: 'Vui lòng thử lại'
                })
            }
            
        })

        $http.get($rootScope.apiFavorite + 'totalFav/' + $rootScope.cart.idUser).then(function (responese) {
            $rootScope.totalFav = responese.data;
        })

        $http.get($rootScope.apiOrderDetail + "total-cart/" + $rootScope.cart.id).then(function (responese) {
            $rootScope.totalCart = responese.data;
        })

        $http.get($rootScope.apiOrderDetail + $rootScope.cart.id).then(function (responese) {
            $rootScope.cartProduct = eval(responese.data);
        })
        // if (check == true) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Đăng nhập thất bại',
        //         text: 'Vui lòng thử lại'
        //     })
        // }
    }
})