//J4jr8Opezv536RpzlaGTnBrJD+aBkmhwg9NIuuaQTFfFaJFi9W/4bl3M0qaSN6Gi
import modifierAssistant from './modifierAssistant';
import { ajax } from 'nc-lightapp-front';
export default function resetAssistant (props) {
    props.form.getAllFormValue('material').rows[0].values['pk_marasstframe'];
    if(props && props.form && props.form.getAllFormValue('material') && props.form.getAllFormValue('material').rows[0]&&props.form.getAllFormValue('material').rows[0].values['pk_marasstframe']){
        let pk_marasstframe = props.form.getAllFormValue('material').rows[0].values['pk_marasstframe'].value;
        ajax({
            url : '/nccloud/uapbd/material/queryMarAssistantByFrameID.do',
            data : {FrameID : pk_marasstframe},
            success : (res) => {
                if(res.data){
                     //更新其他页签中自定义辅助属性的显示
                     modifierAssistant(props,res.data.assistant);
                }
            }
        });
    }
}
//J4jr8Opezv536RpzlaGTnBrJD+aBkmhwg9NIuuaQTFfFaJFi9W/4bl3M0qaSN6Gi