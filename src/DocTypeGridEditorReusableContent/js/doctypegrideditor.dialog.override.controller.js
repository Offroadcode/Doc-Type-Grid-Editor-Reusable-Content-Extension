angular.module('umbraco').controller('Our.Umbraco.DTGERCE.Dialog', ['$scope', '$controller', 'contentResource', 'dialogService', function ($scope, $controller, contentResource, dialogService) {

    // inherit the DocTypeGridEditor dialog controller.
    angular.extend(this, $controller('Our.Umbraco.DocTypeGridEditor.Dialogs.DocTypeGridEditorDialog', { $scope: $scope }));

    console.info('overriding with DTGERCE');

    // Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
    $scope.init = function() {
        $scope.setVariables();
        getNodeContent();
    };

    /**
    * @method setVariables
    * @description Sets up the initial variables for the view.
    */
    $scope.setVariables = function() {
        $scope.content = false;
        $scope.contentTypeAlias = '';
    };

    // Event Handler Methods /////////////////////////////////////////////////////

    $scope.processSelectedNodeToCopyUnder = function(data) {
        if (data && data !== null) {
            if (data.id && data.id !== null) {
                copyDocTypeUnderNode(data.id);
            }
        }
    };

    $scope.processSelectedNodeToImportFrom = function(data) {
        if (data && data !== null) {
            if (data.id && data.id !== null) {
                importFromNode(data.id);
            }
        }
    };

    $scope.selectNodeToCopyUnder = function() {
        var options = {
            multipicker: false,
            callback: $scope.processSelectedNodeToCopyUnder
        };
        dialogService.contentPicker(options);
    };

    $scope.selectNodeToImportFrom = function() {
        var options = {
            multipicker: false,
            callback: $scope.processSelectedNodeToImportFrom
        };
        dialogService.contentPicker(options);
    };

    // Helper Methods ////////////////////////////////////////////////////////////

    function copyDocTypeUnderNode(parentNodeId) {
        if (parentNodeId) {
            contentResource.getScaffold(parentNodeId, $scope.contentTypeAlias).then(function(newNode) {
                if ($scope.content) {
                    newNode.name = $scope.content.name ? $scope.content.name : "Copied Doc Type Grid Content";
                    contentResource.save(newNode, true, []).then(function(savedNode) {
                        var nodeToUpdate = copyContentIntoNode($scope.content, savedNode);
                        contentResource.save(nodeToUpdate, false, []).then(function(updatedNode){

                        });
                    });
                }

            });
        }
    };

    function copyContentIntoNode(content, node) {
        for (var prop in content) {
            if (content.hasOwnProperty(prop)) {
                for (var i = 0; i < node.tabs.length; i++) {
                    if (node.tabs[i]) {
                        for (var j = 0; j < node.tabs[i].properties.length; j++) {
                            if (node.tabs[i].properties[j]) {
                                if (node.tabs[i].properties[j].alias == prop) {
                                    node.tabs[i].properties[j].value = content[prop];
                                }
                            }
                        }
                    }
                }
            }
        }        
        return node;
    };

    /**
     * @method getNodeContent
     * @returns {void}
     * @description Builds an object returning the doc type grid item's 
     * node content.
     */
    function getNodeContent() {
        // It's possible $scope.node isn't ready yet when this first loads.
        // So check that it exists first.
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
            $scope.content = value;
            $scope.contentTypeAlias = $scope.node.contentTypeAlias;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }            
        } else {
            // It didn't exist yet, so wait briefly before trying again.
            setTimeout(getNodeContent, 100);
        }
    };

    function importFromNode(nodeId) {
        contentResource.getById(nodeId).then(function(node) { 
            console.info('node to import from', node);
            console.info('node to copy onto', $scope.node);
            if (node && node.contentTypeAlias && node.contentTypeAlias == $scope.node.contentTypeAlias) {
                for (var i = 0; i < node.tabs.length; i++) {
                    if ($scope.node.tabs[i]) {
                        for (var j = 0; j < node.tabs[i].properties.length; j++) {
                            $scope.node.tabs[i].properties[j].value = node.tabs[i].properties[j].value;
                        }
                    }
                }
                console.info($scope.node.tabs);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }        
                getNodeContent();
            }
        });
    };

    /* Init */
    $scope.init();

}]);