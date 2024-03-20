import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecursiveRecordPickerDemo extends LightningElement {

    objectApiName = 'Demo_Object__c';
    displayFieldApiName = 'Name';
    rootNodeId = ''; // Unspecified Browses all root nodes "a007e00000CUhFdAAL"
    recursiveFieldApiName = 'Demo_Object_Recursion__c';

    handleLeafNodeSelected(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Leaf Node Selected',
            message: 'Id: '+event.detail.id+'\nName: '+event.detail.label,
            variant: 'success',
            mode: 'dismissible'
        }));
    }
}