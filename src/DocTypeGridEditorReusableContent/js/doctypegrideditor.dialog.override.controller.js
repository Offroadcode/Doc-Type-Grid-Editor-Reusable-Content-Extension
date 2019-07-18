angular.module('umbraco').controller('Our.Umbraco.DTGERCE.Dialog', ['$scope', '$controller', 'contentResource', 'dialogService', 'formHelper', '$interpolate', 'notificationsService', function ($scope, $controller, contentResource, dialogService, formHelper, $interpolate, notificationsService) {

    // inherit the DocTypeGridEditor dialog controller.
    angular.extend(this, $controller('Our.Umbraco.DocTypeGridEditor.Dialogs.DocTypeGridEditorDialog', { $scope: $scope }));

    // Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
    * @returns {void}
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
    $scope.init = function() {
        $scope.setVariables();
        getNodeContent();
    };

    /**
    * @method setVariables
    * @returns {void}
    * @description Sets up the initial variables for the view.
    */
    $scope.setVariables = function() {
        $scope.canLink = false;
        $scope.isLinkedToNode = false;
        $scope.linkedNode = {
            id: 0,
            name: '',
            url: ''
        };
        $scope.content = false;
        $scope.contentTypeAlias = '';
    };

    // Event Handler Methods /////////////////////////////////////////////////////

    /**
     * @method processSelectedNodeToCopyUnder
     * @param {Object} data
     * @returns {void}
     * @description Handles returning data from dialog to select a node to copy 
     * the doc type content into.
     */
    $scope.processSelectedNodeToCopyUnder = function(data) {
        if (data && data !== null) {
            if (data.id && data.id !== null) {
                openSaveConfirmDialog(data);
            }
        }
    };

    /**
     * @method processSelectedNodeToImportFrom
     * @param {Object} data
     * @returns {void}
     * @description Handles returning data from dialog to select a node to import 
     * the doc type content from.
     */
    $scope.processSelectedNodeToImportFrom = function(data) {
        if (data && data !== null) {
            if (data.id && data.id !== null) {
                openImportConfirmDialog(data);
            }
        }
    };

    /**
     * @method processSelectedNodeToLink
     * @param {Object} data
     * @returns {void}
     * @description Handles returning data from dialog to select a node to link 
     * the doc type content with.
     */
    $scope.processSelectedNodeToLink = function(data) {
        if (data && data !== null) {
            if (data.id && data.id !== null) {
                openLinkConfirmDialog(data);
            }
        }
    };

    /**
     * @method save
     * @returns {void}
     * @description Overrides the save of the default DocTypeGridEditor dialog's 
     * save() function to insert in a node ID.
     */
    $scope.save = function () {

        // Cause form submitting
        if (formHelper.submitForm({ scope: $scope, formCtrl: $scope.dtgeForm })) {

            // Copy property values to scope model value
            if ($scope.model.node) {
                var value = {
                    name: $scope.model.dialogData.editorName
                };

                for (var t = 0; t < $scope.model.node.tabs.length; t++) {
                    var tab = $scope.model.node.tabs[t];
                    for (var p = 0; p < tab.properties.length; p++) {
                        var prop = tab.properties[p];
                        if (typeof prop.value !== "function") {
                            value[prop.alias] = prop.value;
                        }
                    }
                }

                if (nameExp) {
                    var newName = nameExp(value); // Run it against the stored dictionary value, NOT the node object
                    if (newName && (newName = $.trim(newName))) {
                        value.name = newName;
                    }
                }

                $scope.dialogData.value = value;
            } else {
                $scope.dialogData.value = null;
            }

            $scope.submit($scope.dialogData);
        }
    };

    /**
     * @method selectNodeToCopyUnder
     * @returns {void}
     * @description Opens a content node picker to select a parent node to create a 
     * new node with a copy of the doc type content onto.
     */
    $scope.selectNodeToCopyUnder = function() {
        var options = {
            multipicker: false,
            callback: $scope.processSelectedNodeToCopyUnder
        };
        dialogService.contentPicker(options);
    };

    /**
     * @method selectNodeToImportFrom
     * @returns {void}
     * @description Opens a content node picker to select a node to import 
     * doc type content from.
     */
    $scope.selectNodeToImportFrom = function() {
        var options = {
            multipicker: false,
            filterCssClass: 'not-allowed not-published',
            filter: $scope.model.node.contentTypeAlias,            
            callback: $scope.processSelectedNodeToImportFrom
        };
        dialogService.contentPicker(options);
    };

    /**
     * @method selectNodeToLink
     * @returns {void}
     * @description Opens a content node picker to select a node to link the 
     * doc type content with.
     */
    $scope.selectNodeToLink = function() {
        var options = {
            multipicker: false,
            filterCssClass: 'not-allowed not-published',
            filter: $scope.model.node.contentTypeAlias,
            callback: $scope.processSelectedNodeToLink
        };
        dialogService.contentPicker(options);        
    };

    /**
     * @method unlinkFromNode
     * @returns {void}
     * @description Unlinks the content from a node.
     */
    $scope.unlinkFromNode = function() {
        $scope.isLinkedToNode = false;
        $scope.linkedNode = {
            id: 0,
            name: '',
            url: ''
        };
        $scope.content.dtgeLinkedId = "";
        $scope.updateLinkedId("");
        getNodeContent();
    }

    // Helper Methods ////////////////////////////////////////////////////////////

    /**
     * @method copyDocTypeUnderNode
     * @param {number} parentNodeId 
     * @param {string} nameToSave 
     * @returns void
     * @description Copies the doc type data into a newly saved node under the 
     * node with the id matching parentNodeId.
     */
    function copyDocTypeUnderNode(parentNodeId, nameToSave) {
        getNodeContent();
        if (parentNodeId) {
            contentResource.getScaffold(parentNodeId, $scope.contentTypeAlias).then(function(newNode) {
                if ($scope.content) {
                    if (nameToSave && nameToSave !== "") {
                        newNode.name = nameToSave;
                    } else {
                        newNode.name = $scope.content.name ? $scope.content.name : "Copied Doc Type Grid Content";
                    }
                    contentResource.save(newNode, true, []).then(function(savedNode) {
                        var nodeToUpdate = copyContentIntoNode($scope.model.dialogData.value, $scope.nodeContext.tabs, savedNode);
                        contentResource.publish(nodeToUpdate, false, []).then(function(updatedNode){
                            notificationsService.success('Content Saved', 'Your doc type grid data has been successfully saved for reuse as a content node.')
                        });
                    });
                }
            });
        }
    };

    /**
     * @method copyContentIntoNode
     * @param {Object} content 
     * @param {JSON[]} tabs
     * @param {Object} node
     * @returns {Object}
     * @description Copies the content currently in the dialog editors into the 
     * chosen node object and returns it. 
     */
    function copyContentIntoNode(content, tabs, node) {
        for (var prop in content) {
            if (content.hasOwnProperty(prop)) {
                if (prop !== 'dtgeLinkedId') {
                    var value = '';
                    // get version to save
                    for (var i = 0; i < tabs.length; i++) {
                        for (var j = 0; j < tabs[i].properties.length; j++) {
                            if (tabs[i].properties[j].alias === prop) {
                                value = tabs[i].properties[j].value;
                            }
                        }
                    }
                    // overwrite version on node to save
                    for (var i = 0; i < node.tabs.length; i++) {
                        for (var j = 0; j < node.tabs[i].properties.length; j++) {
                            if (node.tabs[i].properties[j].alias == prop) {
                                node.tabs[i].properties[j].value = value;
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
        // It's possible $scope.model.node isn't ready yet when this first loads.
        // So check that it exists first.
        if ($scope.model.node !== null) {
            var value = {
                name: $scope.model.dialogData.editorName
            };

            for (var t = 0; t < $scope.model.node.tabs.length; t++) {
                var tab = $scope.model.node.tabs[t];
                for (var p = 0; p < tab.properties.length; p++) {
                    var prop = tab.properties[p];
                    if (typeof prop.value !== "function") {
                        value[prop.alias] = prop.value;
                    }
                }
            }

            $scope.content = value;
            $scope.contentTypeAlias = $scope.model.node.contentTypeAlias;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            $scope.getLinkedNode(value);           
        } else {
            // It didn't exist yet, so wait briefly before trying again.
            setTimeout(getNodeContent, 100);
        }
    };

    /**
     * @method getLinkedNode
     * @returns {void}
     * @description Builds an object representing the linked node, if any is linked, 
     * and sets the flag to indicate a node is linked.
     */
    $scope.getLinkedNode = function(value) {
        if (value && (value.dtgeLinkedId || value.dtgeLinkedId == "")) {
            $scope.canLink = true;
            if (value.dtgeLinkedId !== "") {
                $scope.linkedNode.id = value.dtgeLinkedId;
                $scope.linkedNode.url = '/umbraco#/content/content/edit/' + value.dtgeLinkedId;
                contentResource.getById(value.dtgeLinkedId).then(function(node) {
                    $scope.linkedNode.name = node.name;
                    $scope.isLinkedToNode = true;
                });
            }
        }
    };

    /**
     * @method importFromNode
     * @param {number} nodeId 
     * @returns {void}
     * @description Imports the data needed for the dialog's content from the 
     * chosen node.
     */
    function importFromNode(nodeId) {
        contentResource.getById(nodeId).then(function(node) {
            if (node && node.contentTypeAlias && node.contentTypeAlias == $scope.model.node.contentTypeAlias) {
                for (var i = 0; i < node.tabs.length; i++) {
                    if ($scope.model.node.tabs[i]) {
                        for (var j = 0; j < node.tabs[i].properties.length; j++) {
                            if (node.tabs[i].properties[j].alias !== 'dtgeLinkedId') { // don't want to overwrite any linked ID.
                                $scope.model.node.tabs[i].properties[j].value = node.tabs[i].properties[j].value;
                            }
                        }
                    }
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                // Update the data structure used to hold the content to be saved.       
                getNodeContent();
            }
        });
    };

    /**
     * @method openImportConfirmDialog
     * @param {Object} node
     * @returns {void}
     * @description Opens a dialog to confirm that you want to import the doc type 
     * content from the selected node.
     */
    function openImportConfirmDialog(node) {
        var data = {
            contentType: '',
            nodeId: node.id,
            nodeName: node.name,
            isGood: true
        };
        contentResource.getById(node.id).then(function(fullNode) {
            if (fullNode.contentTypeAlias && fullNode.contentTypeAlias !== $scope.model.node.contentTypeAlias) {
                data.isGood = false;
                data.contentType = $scope.model.node.contentTypeAlias;
            }
            dialogService.open({
                template: "/App_Plugins/DocTypeGridEditorReusableContent/views/confirm.import.dialog.html",
                dialogData: data,
                callback: processImportConfirmDialog
            });
        });
    };

    /**
     * @method openLinkConfirmDialog
     * @param {Object} node
     * @returns {void}
     * @description Opens a dialog to confirm that you want to link the doc type 
     * content from the selected node.
     */
    function openLinkConfirmDialog(node) {
        var data = {
            contentType: '',
            nodeId: node.id,
            nodeName: node.name,
            nodeUrl: '/umbraco#/content/content/edit/' + node.id,
            isGood: true
        };
        contentResource.getById(node.id).then(function(fullNode) {
            if (fullNode.contentTypeAlias && fullNode.contentTypeAlias !== $scope.model.node.contentTypeAlias) {
                data.isGood = false;
                data.contentType = $scope.model.node.contentTypeAlias;
            }
            dialogService.open({
                template: "/App_Plugins/DocTypeGridEditorReusableContent/views/confirm.link.dialog.html",
                dialogData: data,
                callback: processLinkConfirmDialog
            });
        });
    };    

    /**
     * @method openSaveConfirmDialog
     * @param {Object} node
     * @returns {void}
     * @description Opens a dialog to confirm that you want to save the doc type 
     * content onto a node under the selected node.
     */
    function openSaveConfirmDialog(node) {
        var data = {
            nodeId: node.id,
            nodeName: node.name,
            nameToSave: $scope.content.name ? $scope.content.name : 'DocType Grid Editor Content',
        };
        dialogService.open({
            template: "/App_Plugins/DocTypeGridEditorReusableContent/views/confirm.save.dialog.html",
            dialogData: data,
            callback: processSaveConfirmDialog
        });
    };
    
    /**
     * @method processSaveConfirmDialog
     * @param {Object} data
     * @returns {void}
     * @description Handles the data returned from the save confirm dialog, sending 
     * it onto a function to actually perform the saving action. 
     */
    function processSaveConfirmDialog(data) {
        copyDocTypeUnderNode(data.nodeId, data.nameToSave);
    };

    /**
     * @method processImportConfirmDialog
     * @param {Object} data
     * @returns {void}
     * @description Handles the data returned from the import confirm dialog, sending 
     * it onto a function to actually perform the import action. 
     */
    function processImportConfirmDialog(data) {
        importFromNode(data.nodeId);
    };

    /**
     * @method processLinkConfirmDialog
     * @param {Object} data
     * @returns {void}
     * @description Handles the data returned from the link confirm dialog. 
     */
    function processLinkConfirmDialog(data) {
        $scope.updateLinkedId(data.nodeId);
        importFromNode(data.nodeId);
        $scope.isLinkedToNode = true;
        $scope.linkedNode = {
            id: data.nodeId,
            name: data.nodeName,
            url: data.nodeUrl
        };
    };

    $scope.updateLinkedId = function(nodeId) {
        if ($scope.model.node && $scope.model.node.tabs && $scope.model.node.tabs.length > 0) {
            for (var i = 0; i < $scope.model.node.tabs.length; i++) {
                for (var j = 0; j < $scope.model.node.tabs[i].properties.length; j++) {
                    if ($scope.model.node.tabs[i].properties[j].alias == 'dtgeLinkedId') {
                        $scope.model.node.tabs[i].properties[j].value = nodeId;
                    }
                }
            }
        }
    };

    /* Init */
    var nameExp = !!$scope.model.nameTemplate
                ? $interpolate($scope.model.nameTemplate)
                : undefined;

    $scope.init();

}]);