<cfcomponent>
	
    <cffunction name="synchronize" access="remote" returntype="struct">
		<cfargument name="id" type="string" required="yes">
		<cfargument name="timestamp" type="string" required="yes">
		<cfargument name="transactions" type="string" required="yes">
        
        <cfreturn application.DataPollCFC.synchronize( id, timestamp, transactions )>
             
    </cffunction>
		
</cfcomponent>