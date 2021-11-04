//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { attrcodeObj, constant } from "./../const";
import {
    loginContext, 
    getContext,
    transformToTree, 
    sortTree ,
    changeButtonByScene
} from "./index";

let {
    treeId,
    formId,
} = constant;
    
let {
    pkProjecttype,
    pkOrg,
    pkProject,
    assetclassDef
} = attrcodeObj;

export default function initTemplate (props) {
    let pageCode = props.getSearchParam('p')
    props.createUIDom({
        pagecode: pageCode
    },(data) => {
        if(data){
            if(data.context){
                loginContext.call(this, data.context);

            }
            if(data.button){
                props.button.setButtons(data.button, () => {
                    let visiableButtons = changeButtonByScene.call(this, ['Save','Cancel','Refresh','CardPrint','Output','SetDefault','AssignCBS','CancelCBS','ImportCBS'],  ['Save','Cancel'], true)
                    props.button.setButtonsVisible(visiableButtons);
                    let disabledButtons = changeButtonByScene.call(this, ['Save','Cancel','Refresh','CardPrint','Output','SetDefault','AssignCBS','CancelCBS','ImportCBS'],  ['Refresh'], true)
                    props.button.setButtonDisabled(disabledButtons);
                });
            }
            if(data.template){
                let  meta= data.template;
                meta = modifierMeta.call(this, meta);
                let refTreeRootName =  pageCode === "10140CBSG-group" ? "CBS-集团" : (pageCode === "10140CBSC-org" ? "CBS-财务组织" : "项目CBS");

                props.meta.setMeta(meta,()=>{
                    let disorderedTreeData = transformToTree.call(this, null, refTreeRootName, [], props);
                    sortTree(disorderedTreeData);
                    props.syncTree.setSyncTreeData(treeId, disorderedTreeData);
                   
                });
            }else{
                return;
            }
        }else{
            return;
        }
    })
}
function modifierMeta( meta){
   if(meta[formId] && meta[formId].items){

       meta[formId].items.map( (item, index) => {
           switch (item.attrcode){
                case assetclassDef :
                    //项目添加过滤条件
                    Object.assign(item, {
                        queryCondition:  () => {
                            let pk_org_value = this.state.pkOrgValueRef.refpk||""
                            return {
                                pk_org : pk_org_value,   
                            }; 
                        }
                    });
                break;
            }
       });
   };
   return meta;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX