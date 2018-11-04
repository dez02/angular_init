angular.module('routerApp', ['routerRoutes', 'ngAnimate'])
  .controller('mainController', function(){
    const vm = this;
    vm.bigMessage = 'blablabla';
  })
  .controller('homeController', function() {
    const vm = this;
    vm.message = 'This is the home page!';
  })
  .controller('aboutController', function(){
    const vm = this;
    vm.message = 'This is the About Page!';
  })
  .controller('contactController', function(){
    const vm = this;
    vm.message = 'This is the contact page!';
  });
