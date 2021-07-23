public with sharing class CDCcontroller {

    @AuraEnabled
    public static List<Case> getCases(string colNames, Id cId) {
      List<SObject> lstObj = new List<SObject>();
      try{
          String queryString = 'SELECT casenumber,'+ colNames + ' FROM case WHERE Id = :cId WITH SECURITY_ENFORCED';
          lstObj = Database.query(queryString);
      } catch(exception e) {
          throw new AuraHandledException('Query Exception ' + e.getMessage());
      }
    }
}