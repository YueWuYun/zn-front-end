//2+0Qf+roUlDHXBeA/o9JMIiPw76taH0hKJDSd6sjDJNkjBs6D0W0DGiBCqpleLUq

import {headButton, bodyButton, innerButton} from '../../common/btnName';
import {TableBtn} from './../content';
export default function(){

    //先把所有的按钮都显示出来，再根据情况隐藏对应的按钮
    let allButton = [];//所有的按钮；先让所有的按钮都显示，然后在根据需要隐藏按钮
    let inBtn = this.props.button.getButtons();
    allButton = getButtonsKey(inBtn,allButton);
    this.props.button.setButtonVisible(allButton, true);

    let unVisibleBtn = [ ];//不可见按钮
    let visibleBtn = [] ;//可见按钮
    let editBtn = [
        headButton.Save,
        headButton.Save_add,
        headButton.Cancel,
        //关联部门
        TableBtn.addccdept,
        TableBtn.delccdept,
        //关联工作中心
        TableBtn.addccwork,
        TableBtn.delccwork,
        //关联费用类型
        TableBtn.addfeetype,
        TableBtn.delfeetype];
    let browserBtn = [ 
        //表头按钮
        headButton.Add,
        headButton.Edit,
        headButton.Version,
        headButton.ImportData,
        headButton.ExportData,
        headButton.Refresh,
        //关联部门、关联工作中心、关联费用类型按钮皆可见
    ];

    if(this.props.form.getFormStatus(this.config.formId) == 'edit'||this.props.form.getFormStatus(this.config.formId)=='add'){//编辑状态
        unVisibleBtn = browserBtn ;
        visibleBtn = editBtn ;
    }else{//浏览态
        unVisibleBtn =  editBtn;
        visibleBtn = browserBtn ;
    }

    this.props.button.setButtonsVisible(visibleBtn,true);//可见按钮设置
    this.props.button.setButtonsVisible(unVisibleBtn,false);//不可见按钮设置
}


let getButtonsKey = function (inBtn, allButton) {
    for (let i = 0; i < inBtn.length; i++) {

        if (inBtn[i].children.length == 0) {
            allButton.push(inBtn[i].key);
        } else {
            allButton.push(inBtn[i].key);
            getButtonsKey(inBtn[i].children, allButton);
        }
    }
    return allButton;
}
//2+0Qf+roUlDHXBeA/o9JMIiPw76taH0hKJDSd6sjDJNkjBs6D0W0DGiBCqpleLUq