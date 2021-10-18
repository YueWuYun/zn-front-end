export default  function(nodetype,pk_org,pk_group,pk_orgs,curGroup){

    let resultMessage = nodetype==='GLOBE_NODE'&&!!pk_org&&pk_org!=='GLOBLE00000000000000'?
            {
                message:this.state.json['manageMode-001'],
                editFlag:false
            }:
            nodetype==='GROUP_NODE'&&!!pk_org&&pk_org!==curGroup?
                {
                    message:this.state.json['manageMode-002'],
                    editFlag:false
                }:
                nodetype==='ORG_NODE'&& pk_orgs && !( pk_orgs.length >0 && !!pk_org && pk_orgs.includes(pk_org) )?
                    {
                        message:this.state.json['manageMode-003'],
                        editFlag:false
                    }:
                    {
                        message:'',
                        editFlag:true
                    };
    return resultMessage;
}