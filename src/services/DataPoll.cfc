<cfcomponent>
	
    <cffunction name="synchronize" access="public" returntype="struct">
        <cfargument name="id" type="string" required="yes">
        <cfargument name="timestamp" type="string" required="yes">
        <cfargument name="transactions" type="string" required="yes">
        
        <cfscript>
            
            var newTransactions = deserializeJSON(transactions); 
            
            if( ! structkeyexists(this, "id#id#") ){
                this[ "id#id#" ] = ArrayNew(1);
            }
            
            var existingTransactions = this[ "id#id#" ];
            var serializeTransactions = ArrayNew(1);
            var numberTimestamp = LSParseNumber( timestamp );
            
            //check existing tranactions to return to client
            for (i = 1; i lte ArrayLen(existingTransactions); i++) {
                var item = existingTransactions[i];
                if ( item.timestamp GT numberTimestamp ) {
                    ArrayAppend( serializeTransactions, item.content );
                }
            }
            
            var newTimestamp = GetTickCount();
            
            //add new transactions to server
            for (i = 1; i lte ArrayLen(newTransactions); i++) {
                var item = {};
                
                if ( structkeyexists( newTransactions[i], "clear" )) {
                    serializeTransactions = ArrayNew(1);
                    existingTransactions = ArrayNew(1);	
                }
                        
                item.timestamp = newTimestamp;
                item.content = newTransactions[i];
                ArrayAppend( existingTransactions, item );
            }
        
            var result = {};
            result.transactions = serializeTransactions;
            
            result.timestamp = newTimestamp;
            this[ "id#id#" ] = existingTransactions;;
        
        </cfscript>
        
        <cfreturn result>
    </cffunction>
    
</cfcomponent>

