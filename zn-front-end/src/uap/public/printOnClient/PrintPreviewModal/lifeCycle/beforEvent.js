
import { modifyMeta, initFormVal} from '../method';
export default function beforEvent(props, moduleId, key, value, oldValue) {
  if(["pageFrom", "pageTo"].includes(key)) {
    changePrintRange(props, moduleId);
  }
  return true;
}

function changePrintRange(props, moduleId) {
  let pageRangeTypeVal = props.form.getFormItemsValue(moduleId,"pageRangeType");
  if(1 != pageRangeTypeVal) {
    props.form.setFormItemsValue(moduleId, {
      "pageRangeType":{
        display: "页面",
        value: 1
      }
    })
  }
}