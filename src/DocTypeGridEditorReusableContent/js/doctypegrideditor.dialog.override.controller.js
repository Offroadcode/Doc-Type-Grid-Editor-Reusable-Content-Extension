angular.module('umbraco').controller('Our.Umbraco.DTGERCE.Dialog',
    ['$scope', '$controller',
    function ($scope, $controller) {
        // inherit core delete controller
        angular.extend(this, $controller('Our.Umbraco.DocTypeGridEditor.Dialogs.DocTypeGridEditorDialog', { $scope: $scope }));

        console.info('ovrriding with DTGERCE');


    }]);