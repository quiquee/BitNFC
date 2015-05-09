/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('bitNFC', [
    'ionic',
    '720kb.fx',
    'bitNFC.providers',
    'bitNFC.factories',
    'bitNFC.controllers'])

  .config(['$stateProvider', '$urlRouterProvider',
    function configurationFunction($stateProvider, $urlRouterProvider) {

      $stateProvider
      .state('app', {
        'url': '/app',
        'abstract': true,
        'templateUrl': 'views/layout/index.html'
      })
      .state('app.home', {
        'url': '/home',
        'views': {
          'appContent': {
            'templateUrl': 'views/home/index.html',
            'controller': 'HomeCtrl'
          }
        }
      })
      .state('app.receive', {
        'url': '/receive',
        'views': {
          'appContent': {
            'templateUrl': 'views/receive/index.html',
            'controller': 'ReceiveCtrl'
          }
        }
      })
      .state('app.send', {
        'url': '/send',
        'params': {
          'privateKey': undefined
        },
        'views': {
          'appContent': {
            'templateUrl': 'views/send/index.html',
            'controller': 'SendCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/app/home');
    }])

.run(['$ionicPlatform', '$rootScope', '$window', '$state', '$ionicPopup', 'nfc', 'BitCoin',
  function onApplicationStart($ionicPlatform, $rootScope, $window, $state, $ionicPopup, nfc, BitCoin) {

    $ionicPlatform.ready(function onReady() {

      if ($window.cordova &&
        $window.cordova.plugins &&
        $window.cordova.plugins.Keyboard) {

        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if ($window.StatusBar) {

      $window.StatusBar.styleLightContent();
    }

    nfc.registerListeners();
  });

    $rootScope.$on('nfc:status-ok', function onNfcStatusOk() {

      $rootScope.nfcStatus = true;
    });

    $rootScope.$on('nfc:status-ko', function onNfcStatusOk(eventsInformations, payload) {

      $rootScope.nfcStatus = false;
      if (payload &&
        payload.error) {

        $ionicPopup.alert({
          'title': 'Oh snap!',
          'template': payload.error
        });
    }
  });

    $rootScope.$on('nfc:status-empty', function onEmptyTag() {

      // var address = antani.BitCoin.get.address ?
      var address = "1asdasd";

      $ionicPopup.confirm({
        'title': 'NFC Bitcoin Wallet Generated',
        'template': 'Your empty NFC tag is now a bitcoin wallet!<br>A Private Key has been loaded into the Tag and this is the corresponding (public) Address: '+this.address+' - 0 mBTC -- you can now send money to the token.'
      }).then(function onUserTouch(res) {

        if (res) {

          $state.go('app.send', {
            'privateKey': BitCoin.generatePrivateKey()
          });
        }
      });
    });
  }]);
}(angular));
