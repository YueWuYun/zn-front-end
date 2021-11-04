//2GrbXrJmgm8eIvrrXt5HPiv0GAr5ebKzpMQF0hZ04YWhHXn3uZGzaaH41qrGbg1U
/**
 * 银行账户列表复选框选中事件
 * @param props
 * @param moduleId
 * @param record
 * @param index
 * @param status
 */
import {getBusinessInfo} from 'nc-lightapp-front';
export default function(props,moduleId,record,index,status){
    //此处控制按钮的隐藏显示及启用状态
    let accstate = record.accstate.value;
    let tableData = props.table.getCheckedRows(moduleId);
    let length = tableData.length;//获取列表页选择数据的行数
    let pk_org = record.pk_org.value;
    //销户的账户不能点的按钮
    props.button.setButtonDisabled( ['btnDel'],  (!status && length === 0||status && accstate === '3'));
    //销户或者选择行数大于1不能点的按钮
    props.button.setButtonDisabled( ['btnUpgrade','btnCancellAcc','btnAdjust'], (length !== 1 ||status && accstate === '3'));
    //销户不能点的按钮
    props.button.setButtonDisabled( ['btnAuthorization','authorization','unAuthorization'],(!status && length === 0 ||  status && accstate === '3'));
    //财务组织节点集团数据查看使用权按钮不能点
    props.button.setButtonDisabled(['usufruct'], (length !== 1 || status && accstate === '3' || status && (props.config.NODE_TYPE ==='ORG_NODE' && getBusinessInfo().groupId===pk_org)));
    props.button.setButtonDisabled(['listDisable'],(!status && length === 0 || length === 1 &&status &&  tableData[0].data.values.enablestate.value === false));
    props.button.setButtonDisabled(['listEnable'],(!status && length ===0 || length === 1 && status &&  tableData[0].data.values.enablestate.value === true));
    this.setState(this.state);//平台提供的api设置按钮禁用状态好像不及时更新，故此处手动设置
}

//2GrbXrJmgm8eIvrrXt5HPiv0GAr5ebKzpMQF0hZ04YWhHXn3uZGzaaH41qrGbg1U