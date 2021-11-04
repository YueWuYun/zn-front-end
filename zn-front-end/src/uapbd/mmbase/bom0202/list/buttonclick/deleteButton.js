//w1rO/vRlviZDO3b+wcpWO/wqs8z4rrwcGIQu/Q380ZCLdpY2RT9XGcHr2cie7DUZ
import { createPage, ajax, cacheTools, base, toast, high, promptBox, cardCache, getMultiLang } from 'nc-lightapp-front';

const tableId = 'bomwh_head';  

const _props = null;

function deleteClick(props,state){
    props.table.getCheckedRows(tableId);
    promptBox({
        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        content: state.json['110140BOMM3005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
        beSureBtnName: state.json['110140BOMM3008'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
        cancelBtnName: state.json['110140BOMM3009'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
        beSureBtnClick: (props)=>{deleteAction(props)}   // 确定按钮点击调用函数,非必输
    })
} 
function deleteAction(props){
    let datas = props.table.getCheckedRows(tableId);
    if(datas){
        console.log(datas);
    }else{
        let params = {
            id: this.selectedRowRecord[pk_item].value,
            ts: this.selectedRowRecord.ts.value
        }
        debugger;
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({ color: "success", title: this.state.json['10140TAXRE-000019'] });/* 国际化处理： 删除成功！*/
                // this.refreshAction(props);
            }
        });
    } 
}

let deleteButton = {
	deleteClick,deleteAction
};

export default deleteButton;
//w1rO/vRlviZDO3b+wcpWO/wqs8z4rrwcGIQu/Q380ZCLdpY2RT9XGcHr2cie7DUZ