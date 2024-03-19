/**
 * LWC to support recursive child object traversal for the same object type
 * 
 * @author Chayse McMillan
 */
import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRelatedListResults from '@salesforce/apex/RecursiveRecordPickerController.getRelatedListResults';

export default class RecursiveRecordPicker extends LightningElement {

    traversalSelections = [];

    /**
     * The object api name to perform recursion against -- Ex: "My_Object__c"
     */
    @api set objectApiName(val) {
        this._objectApiName = val;
    }
    _objectApiName;
    get objectApiName() {
        return this._objectApiName;
    }

    /**
     * The display field Api Name (User Facing Traversal Value) -- Ex: "Name" field
     */
    @api set displayFieldApiName(val) {
        this._displayFieldApiName = val;
    }
    _displayFieldApiName;
    get displayFieldApiName() {
        return this._displayFieldApiName;
    }

    /**
     * The root node sObject Id to base the recursive selection on -- Ex: "000000000000" (sf record Id)
     */
    @api set rootNodeId(val) {
        this._rootNodeId = val;
    }
    _rootNodeId;
    get rootNodeId() {
        return this._rootNodeId;
    }

    /**
     * The field reference on the target object that supports recursion -- Ex: "My_Recursive_Object_Lookup__c"
     */
    @api set recursiveFieldApiName(val) {
        this._recursiveFieldApiName = val;
    }
    _recursiveFieldApiName;
    get recursiveFieldApiName() {
        return this._recursiveFieldApiName;
    }

    /**
     * Wire method to query child records for thec current "rootNodeId"
     */
    _getRelatedListResults;
    @wire(getRelatedListResults, {
        recursiveQueryRequestJSON: JSON.stringify({
            objectApiName: '$objectApiName',
            displayFieldApiName: '$displayFieldApiName',
            recursiveFieldApiName: '$recursiveFieldApiName',
            parentRecordId: '$rootNodeId'
        })
    }) getRelatedListResults(wireResult) {
        this._getRelatedListResults = wireResult;
        const { data, error } = wireResult;
        if(data) {

            console.log('woo hoo!');

        } else if (error) {
            console.log('error: '+JSON.stringify(error));
            this.submitToastNotification('Error Submitting Recursive Query!', JSON.stringify(error), 'error', 'sticky');
        }
    }

    /**
     * 
     * @param {*} data 
     */
    handleInboundRelatedListData(data) {

    }

    /**
     * 
     * @param {*} title 
     * @param {*} message 
     * @param {*} variant 
     * @param {*} mode 
     */
    submitToastNotification(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }

}