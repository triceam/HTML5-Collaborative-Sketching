<cfcomponent
    displayname="RealtimeSketch">
     
    <cfset THIS.Name = "RealtimeSketch" />
    <cfset THIS.SessionManagement = false />
    <cfset THIS.SetClientCookies = false />
    
    <cffunction
        name="OnApplicationStart"
        access="public"
        returntype="boolean"
        output="false">
         
        <cfset application.DataPollCFC = new DataPoll()>
        <cfreturn true />
    </cffunction>
     
</cfcomponent>