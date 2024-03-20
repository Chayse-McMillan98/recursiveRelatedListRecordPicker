/**
 * LWC to support recursive child object traversal for the same object type
 * 
 * @author Chayse McMillan
 */
import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRelatedListResults from '@salesforce/apex/RecursiveRecordPickerController.getRelatedListResults';

export default class RecursiveRecordPicker extends LightningElement {
    
    dataLoaded = false;
    selectionActive = false;
    leafNodeSelected = false;
    picklistFieldText = '';
    @track picklistRecordOptions = [];

    /**
     * REQUIRED: The object api name to perform recursion against -- Ex: "My_Object__c"
     */
    @api set objectApiName(val) {
        this._objectApiName = val;
    }
    _objectApiName;
    get objectApiName() {
        return this._objectApiName;
    }

    /**
     * REQUIRED: The display field Api Name (User Facing Traversal Value) -- Ex: "Name" field
     */
    @api set displayFieldApiName(val) {
        this._displayFieldApiName = val;
    }
    _displayFieldApiName;
    get displayFieldApiName() {
        return this._displayFieldApiName;
    }

    /**
     * REQUIRED: The root node sObject Id to base the recursive selection on -- Ex: "000000000000" (sf record Id)
     */
    @api set rootNodeId(val) {
        this._rootNodeId = val;
    }
    _rootNodeId;
    get rootNodeId() {
        return this._rootNodeId;
    }

    /**
     * REQUIRED: The field reference on the target object that supports recursion -- Ex: "My_Recursive_Object_Lookup__c"
     */
    @api set recursiveFieldApiName(val) {
        this._recursiveFieldApiName = val;
    }
    _recursiveFieldApiName;
    get recursiveFieldApiName() {
        return this._recursiveFieldApiName;
    }

    /**
     * OPTIONAL: Picklist Label
     */
    @api picklistLabel;



    get recursiveQueryRequestJSON() {
        return JSON.stringify({
            objectApiName: this.objectApiName,
            displayFieldApiName: this.displayFieldApiName,
            recursiveFieldApiName: this.recursiveFieldApiName,
            parentRecordId: this.rootNodeId
        });
    }

    /**
     * Wire method to query child records for thec current "rootNodeId"
     */
    _getRelatedListResults;
    @wire(getRelatedListResults, {
        recursiveQueryRequestJSON: '$recursiveQueryRequestJSON'
    }) getRelatedListResults(wireResult) {
        this._getRelatedListResults = wireResult;
        const { data, error } = wireResult;
        if(data || error) {
            if(data) {
                this.handleInboundRelatedListData(data);
            } else if (error) {
                console.log('error: '+JSON.stringify(error));
                this.submitToastNotification('Error Submitting Recursive Query!', JSON.stringify(error), 'error', 'sticky');
            }
            this.dataLoaded = true;
        }
    }

    handleInboundRelatedListData(data) {
        this.picklistRecordOptions = [];

        // A leaf node was selected -- no further recursion required
        if(!data || data.length == 0) {
            this.leafNodeSelected = true;
            return;
        }

        // Refresh the picklist options with the selected records child nodes
        data.forEach((picklistOption) => {
            this.picklistRecordOptions.push({
                label: picklistOption[this.displayFieldApiName],
                value: picklistOption['Id']
            })
        });
    }

    submitToastNotification(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }


    //
    // UI Event Handlers
    //
    handleRecordSelectionFocus(event) {
        this.selectionActive = true;
    }

    handlePicklistSelection(event) {

        // Append to the display traversal
        if(this.picklistFieldText) {
            this.picklistFieldText += ' > ';
        }
        this.picklistFieldText += event.currentTarget.getAttribute("name");

        // Refresh the search values
        this.rootNodeId = event.currentTarget.getAttribute("apiname");
        this.dataLoaded = false;
        refreshApex(this._getRelatedListResults);
    }

}