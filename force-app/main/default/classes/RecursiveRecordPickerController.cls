public with sharing class RecursiveRecordPickerController {

    public class RecursiveQueryRequest {
        public String objectApiName;
        public String displayFieldApiName;
        public String recursiveFieldApiName;
        public String parentRecordId;
    }
    

    /**
     * Submits a query against the defined query request parameters
     * 
     * @param recursiveQueryRequestJSON -- The RecursiveQueryRequest in JSON form
     * @return A list of object records
     */
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRelatedListResults(String recursiveQueryRequestJSON) {
        try {

            // Parse the query request
            RecursiveQueryRequest queryRequest = (RecursiveQueryRequest) System.JSON.deserialize(recursiveQueryRequestJSON, RecursiveQueryRequest.class);
            System.debug('recursiveQueryRequestJSON: '+recursiveQueryRequestJSON);

            // Build the dynamic query
            String recursiveQuery =
                'SELECT Id, '+queryRequest.displayFieldApiName+' '+
                'FROM '+queryRequest.objectApiName+' '+
                'WHERE '+queryRequest.recursiveFieldApiName+' = \''+queryRequest.parentRecordId+'\' '+
                'LIMIT 10000';
            System.debug('recursiveQuery: '+recursiveQuery);

            return Database.query(recursiveQuery);

        } catch(Exception ex) {
            // Your Own Error handling here!
            System.debug('Error: '+ex.getMessage()+' '+ex.getStackTraceString());
            throw ex;
        }
    }
}