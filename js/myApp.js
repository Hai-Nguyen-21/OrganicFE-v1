var app = angular.module('my-app', ['angularUtils.directives.dirPagination','ngRoute']);

app.run(function ($rootScope, $http) {

    $rootScope.user = null;
    $rootScope.isAdmin = false;
    $rootScope.isUser = true;
    $rootScope.cart = null;
    $rootScope.isVisible = false;
    $rootScope.isToggleLogin = false;
    $rootScope.isSlide = true;
    $rootScope.showCart = true;
    $rootScope.totalUser = 0;
    
    // =================API==================

    $rootScope.apiCategory = 'http://localhost:8080/api/categories';
    $http.get($rootScope.apiCategory).then(function (responese) {
        $rootScope.categories = eval(responese.data);
    })

    $rootScope.apiFavorite = 'http://localhost:8080/api/favorites/';
    $http.get($rootScope.apiFavorite + 'featureds').then(function (responese) {
        $rootScope.featureds = eval(responese.data);
    })

    $rootScope.apiProduct = 'http://localhost:8080/api/products/';

    $rootScope.apiOrderDetail = 'http://localhost:8080/api/orderdetail/';

    $rootScope.apiOrder = 'http://localhost:8080/api/order/';
    
    $rootScope.apiUser = 'http://localhost:8080/api/user/';
    $http.get($rootScope.apiUser).then(function (responese) {
        $rootScope.listUser = eval(responese.data);
        for(let i = 0; i < responese.data.length; i++){
            if(responese.data[i].role == 1){
                $rootScope.totalUser++;
            }
        }
    })

    $rootScope.apiUserLike = 'http://localhost:8080/api/user/liked/';
    $http.get($rootScope.apiUserLike+'report-count').then(function(responese){
        $rootScope.listUserLike = responese.data;
    })
    

    // =================CHECK==================

    if (sessionStorage.getItem('login')) {
        $rootScope.user = angular.fromJson(sessionStorage.getItem('login'));
        $rootScope.cart = angular.fromJson(sessionStorage.getItem('cart'));
        $rootScope.showCart = angular.fromJson(sessionStorage.getItem('showCart'));
        if ($rootScope.showCart) {
            $http.get($rootScope.apiFavorite + 'totalFav/' + $rootScope.cart.idUser).then(function (responese) {
                $rootScope.totalFav = responese.data;
            })

            $http.get($rootScope.apiOrderDetail + "total-cart/" + $rootScope.cart.id).then(function (responese) {
                $rootScope.totalCart = responese.data;
            })

            $http.get($rootScope.apiOrderDetail + $rootScope.cart.id).then(function (responese) {
                $rootScope.cartProduct = eval(responese.data);
            })
            $rootScope.isUser = true;
        } else {
            $rootScope.isAdmin = true;
        }
    } else {
        $rootScope.user = null;
    }


    // =================FUNCTION==================

    $rootScope.logout = function () {
        $rootScope.user = null;
        $rootScope.isAdmin = false;
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('cart');
        Swal.fire({
            icon: 'warning',
            title: 'Đã đăng xuất',
            text: 'Quay lại trang chủ!',
            showConfirmButton: false,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            timer: 1600
        });
        window.location.href = '#!home';
    }

    $rootScope.addToCart = function (id) {
        if ($rootScope.user == null) {
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
            $http.get($rootScope.apiProduct + id).then(function(responese) {
                // var cart = new Cart(responese.data.id, responese.data.name, responese.data.image, responese.data.price, responese.data.quantity, Number(responese.data.price) * Number(responese.data.quantity));
                // console.log(cart);
                $rootScope.item = responese.data;
                // console.log($rootScope.item);
            })
            $http.get($rootScope.apiOrderDetail + $rootScope.cart.id).then(function(responese) {
                // console.log(responese.data);
                if (responese.data.length == 0) {
                    $http.post($rootScope.apiOrderDetail, {
                        "idOrder": $rootScope.cart.id,
                        "idProduct": id,
                        "nameProduct": $rootScope.item.name,
                        "imageProduct": $rootScope.item.image,
                        "price": $rootScope.item.price,
                        "quantity": 1,
                        "total": $rootScope.item.price
                    })
                    let i = Number($rootScope.totalCart);
                    i++;
                    $rootScope.totalCart = i;
                } else {
                    for (let i = 0; i < responese.data.length; i++) {
                        if (responese.data[i].idProduct == id) {
                            $rootScope.itemGarbage = responese.data[i];
                            // console.log("có hàng");
                        } 
                    }
                    if($rootScope.itemGarbage != null){
                        // console.log("update");
                        $http.put($rootScope.apiOrderDetail + $rootScope.itemGarbage.id, {
                            "id": $rootScope.itemGarbage.id,
                            "idOrder": $rootScope.cart.id,
                            "idProduct": id,
                            "nameProduct": $rootScope.itemGarbage.name,
                            "imageProduct": $rootScope.itemGarbage.image,
                            "price": $rootScope.itemGarbage.price,
                            "quantity": Number($rootScope.itemGarbage.quantity) + 1
                        })
                        $rootScope.itemGarbage = null;
                    } else {
                        // console.log("thêm mới");
                        $http.post($rootScope.apiOrderDetail, {
                            "idOrder": $rootScope.cart.id,
                            "idProduct": id,
                            "nameProduct": $rootScope.item.name,
                            "imageProduct": $rootScope.item.image,
                            "price": $rootScope.item.price,
                            "quantity": 1,
                            "total": $rootScope.item.price
                        })
                        let i = Number($rootScope.totalCart);
                        i++;
                        $rootScope.totalCart = i;
                    }
                }
            })
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

    $rootScope.addToFav = function (id) {
        $http.get($rootScope.apiProduct + id).then(function (responese) {
            $rootScope.itemFAV = eval(responese.data);
        })
        if ($rootScope.user == null) {
            Swal.fire({
                title: 'Chưa đăng nhập!',
                text: 'Vui lòng đăng nhập trước khi thêm sản phẩm vào mục Yêu thích!',
                icon: 'info',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            })
        } else {
            var index = -1;
            $http.get($rootScope.apiFavorite + $rootScope.user.id).then(function(responese) {
                for (let i = 0; i < responese.data.length; i++) {
                    if (responese.data[i].id_product == id) {
                        Swal.fire({
                            title: 'Đã tồn tại!',
                            text: 'Sản phẩm này đã được thêm vào mục Yêu thích!',
                            icon: 'info',
                            showConfirmButton: false,
                            closeOnClickOutside: false,
                            allowOutsideClick: false,
                            timer: 2000
                        })
                        $rootScope.itemFAV = responese.data[i];
                        index = 1;
                        window.location.href = "#!product-fav/" + $rootScope.user.id;
                    } else {
                        index = -1;
                    }
                }
                if (index == -1) {
                    $http.post($rootScope.apiFavorite, {
                        "nameProduct": $rootScope.itemFAV.name,
                        "imageProduct": $rootScope.itemFAV.image,
                        "priceProduct": $rootScope.itemFAV.price,
                        "id_product": id,
                        "id_user": $rootScope.user.id
                    })
                    let i = Number($rootScope.totalFav);
                    i++;
                    $rootScope.totalFav = i;
                    Swal.fire({
                        title: 'Thêm thành công!',
                        text: 'Thêm thành công 1 sản phẩm vào mục Yêu thích!',
                        icon: 'success',
                        showConfirmButton: false,
                        closeOnClickOutside: false,
                        allowOutsideClick: false,
                        timer: 2000
                    })
                }
            })
        }
    }
})

app.config(function ($routeProvider) {
    $routeProvider
        .when(
            '/home',
            {
                templateUrl: 'html/user/home.html'
            }
        )
        .when(
            '/product-detail/:id',
            {
                templateUrl: 'html/user/product-detail.html',
                controller: 'productDetailUserController'
            }
        )
        .when(
            '/product-grid/:id',
            {
                templateUrl: 'html/user/product-grid.html',
                controller: 'productGridController'
            }
        )
        .when(
            '/product-fav/:id',
            {
                templateUrl: 'html/user/product-fav.html',
                controller: 'productFavoriteController'
            }
        )
        .when(
            '/cart/:id',
            {
                templateUrl: 'html/user/cart.html',
                controller: 'cartController'
            }
        )
        .when(
            '/profile',
            {
                templateUrl: 'html/user/profile.html',
                controller: 'profileController'
            }
        )
        .when(
            '/admin/home',
            {
                templateUrl: 'html/admin/home.html',
                controller: 'homeAdminController'
            }
        )
        .when(
            '/admin/cart-list',
            {
                templateUrl: 'html/admin/cart-list.html'
            }
        )
        .when(
            '/admin/detail-cart',
            {
                templateUrl: 'html/admin/cart-list.html'
            }
        )
        .when(
            '/admin/product-detail/:id',
            {
                templateUrl: 'html/admin/product-detail.html',
                controller: 'productDetailController'
            }
        )
        .when(
            '/admin/cart-list',
            {
                templateUrl: 'html/admin/cart-list.html',
                controller: 'cartListController'
            }
        )
        .when(
            '/admin/report',
            {
                templateUrl: 'html/admin/report.html',
                controller: 'reportController'
            }
        )
        .when(
            '/admin/add',
            {
                templateUrl: 'html/admin/product-add.html',
                controller: 'newProductController'
            }
        )
        .otherwise({ redirectTo: "/home" });
})

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
                    });
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
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đăng nhập thành công!',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        closeOnClickOutside: false,
                        allowOutsideClick: false
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

// app.controller('registerController', function($scope, $rootScope, $http){
//     $scope.register = function(){
//         $http.post($rootScope.apiUser, {
//             "username": $scope.username_register,
//             "password": $scope.password_register,
//             "fullname": $scope.fullname_register,
//             "phone": "null",
//             "address": "null",
//             "role": true
//         }).then(function(responese){
//             if(responese.data != null){
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Đăng kí khoản thành công!',
//                     text: 'Vui lòng đăng nhập lại bằng tài khoản mới!',
//                     showConfirmButton: false,
//                     closeOnClickOutside: false,
//                     allowOutsideClick: false,
//                     timer: 1600
//                 });
//             } else {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Đăng kí khoản thất bại!',
//                     text: 'Vui lòng đăng ký lại sau!',
//                     showConfirmButton: false,
//                     closeOnClickOutside: false,
//                     allowOutsideClick: false,
//                     timer: 1600
//                 });
//             }
//         })
//     }
// })

app.directive('rePass', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, mCtrl) {
            const checkPass = function (value) {
                var oldPass = scope.password_register;
                if (value == oldPass) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            }
            mCtrl.$parsers.push(checkPass);
        }
    }
});