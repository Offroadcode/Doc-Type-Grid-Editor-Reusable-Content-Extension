angular.module('umbraco').controller('Our.Umbraco.DTGERCE.Dialog',
    ['$scope', '$controller',
    function ($scope, $controller) {
        // inherit core delete controller
        angular.extend(this, $controller('Our.Umbraco.DocTypeGridEditor.Dialogs.DocTypeGridEditorDialog', { $scope: $scope }));

        console.info('overriding with DTGERCE');

        function waitForNode() {
            if ($scope.node !== null) {
                var value = {
                    name: $scope.dialogOptions.editorName
                };

                for (var t = 0; t < $scope.node.tabs.length; t++) {
                    var tab = $scope.node.tabs[t];
                    for (var p = 0; p < tab.properties.length; p++) {
                        var prop = tab.properties[p];
                        if (typeof prop.value !== "function") {
                            value[prop.alias] = prop.value;
                        }
                    }
                }
                console.info('value of node in $scope', value);
            } else {
                setTimeout(waitForNode, 100);
            }
        };

        waitForNode();

    }]);