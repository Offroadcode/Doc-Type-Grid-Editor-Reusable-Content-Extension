angular.module('umbraco.services').config([
   '$httpProvider',
   function ($httpProvider) {

       $httpProvider.interceptors.push(['$q','$injector', 'notificationsService', function ($q,$injector, notificationsService) {
           return {
               'request': function (request) {

                   // Redirect any requests to built in content delete to our custom delete
                   if (request.url.indexOf("/App_Plugins/DocTypeGridEditor/Views/doctypegrideditor.dialog.html") === 0) {
                       request.url = '/App_Plugins/DocTypeGridEditorReusableContent/views/doctypegrideditor.dialog.override.html';
                   }
                       
                   return request || $q.when(request);
               }
           };
       }]);

   }]);