/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
//引入常量定义
import { SHOW_MODE, CARD_PAGE_INFO, URL_INFO ,LIST_PAGE_INFO ,CARD_BUTTON_BROWSE_USE ,CARD_BUTTON_BROWSE_NOT,CARD_BUTTON_EDIT_USE,CARD_BUTTON_EDIT_NOT} from '../../cons/constant';
import appBase from "../../base";
const { cons, api } = appBase;
/** 
 * 处理按钮的可见性
 * @param {*} props 界面内置对象 
 */
export const buttonVisible = function (props, moduleId, newVal, oldVal, isRowCopy = false) {
    if (props.button.getButtons().length == 0) {
        return;
    }    
    
    //界面状态
    let status = props.getUrlParam("status");  
    let istransfer = props.getUrlParam(URL_INFO.PARAM.ISTRANSFER);
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
    //转单场景
    if (istransfer) {
        
    }    
    else if (status == 'browse') {       
        //单据状态Bodygroup
        let busistatus = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'busistatus').value;
        //审批状态
        let vbillstatus = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'vbillstatus').value;       
        if (busistatus == LIST_PAGE_INFO.BUSISTATUS.NEEDCOMMIT) {
			// 待提交
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.NEEDCOMMIT, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.NEEDCOMMIT, false); 
		} else if (busistatus == LIST_PAGE_INFO.BUSISTATUS.NEEDAPPROVE) {
			// 待审批
			props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.NEEDAPPROVE, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.NEEDAPPROVE, false); 
		} else if (busistatus == LIST_PAGE_INFO.BUSISTATUS.NEEDGENERATE) {
			// 待生成
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.NEEDGENERATE, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.NEEDGENERATE, false); 
		} else if (busistatus == LIST_PAGE_INFO.BUSISTATUS.PARTGENERATE) {
			// 部分生成
			props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.PARTGENERATE, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.PARTGENERATE, false); 
		} else if (busistatus == LIST_PAGE_INFO.BUSISTATUS.READYGENERATE) {
			// 已生成
			props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.READYGENERATE, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.READYGENERATE, false); 
		} else if (busistatus == LIST_PAGE_INFO.BUSISTATUS.FREE) {
			// 自由态
			props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.FREE, true);            
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.FREE, false); 
        } else {
            //空白态
            // props.button.setButtonVisible(['Addlist'], true);
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.ALL, true); 
            props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.ALL, false); 
        }
        props.button.setButtonVisible(CARD_BUTTON_EDIT_USE.EDIT_USE, false);        
      
    }
    //编辑态 新增态 复制
    else if (status == SHOW_MODE.ADD || status == SHOW_MODE.EDIT || status == SHOW_MODE.COPY) {
        props.button.setButtonVisible(CARD_BUTTON_EDIT_USE.EDIT_USE, true);
        props.button.setButtonVisible(CARD_BUTTON_EDIT_NOT.NOT_USE, false); 
        
        let flag = props.getUrlParam("isRowCopy"); 
        if (flag ==true) {
            props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], false);
            props.button.setButtonVisible(['PastTail','BodyCancel'], true);
        }else{
            props.button.setButtonVisible(['AddbodyBtn','DeletebodyBtn','CopybodyBtn'], true);
            props.button.setButtonVisible(['PastTail','BodyCancel'], false);
        }
    }
    else{
        //空白态
        props.button.setButtonVisible(CARD_BUTTON_BROWSE_USE.ALL, true); 
        props.button.setButtonVisible(CARD_BUTTON_BROWSE_NOT.ALL, false);  
    }
    
}

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/