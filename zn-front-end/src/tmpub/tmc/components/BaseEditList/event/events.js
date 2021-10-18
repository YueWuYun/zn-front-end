/*GKsT8Jv7ysLQ2bKlu6b9T1mHstRNJnHB4ouMERTAM2FhjYzJ4XYpdHBlz9rcn43S*/
/** 
* 公共事件
* @author dongyue7
*/

import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { bodyBtnOperation } from './editListButtonClick';
import { trimStr } from './utils';

/**
 * 获取传输数据
 * @param {*} props    页面内置对象
 * @param {*} savedata 待处理数据
 * @param {*} opr      操作
 */
export function getSendData(props, opr, saveData) {
    let data;
    if ( opr === 'save' ) { // 保存、启用、停用时
        if ( Array.isArray(saveData) ) { // 肩部按钮点击
            // 删除保存数据中已在编辑态批量删除过的数据
            for ( let i=0;i<saveData.length;i++ ) {
                for ( let j=0;j<this.state.editDelData.model.rows.length;j++ ) {
                    if( saveData[i].values[this.primaryId].value == this.state.editDelData.model.rows[j].values[this.primaryId].value ) {
                        saveData.splice( i, 1 );
                    }
                }
            }
        } else { // 列表操作列点击
            saveData = [saveData];
        }
        // 获取保存数据
        data = {
            pageid: this.pageId,
            templetid: this.tableOid,
            model: {
                areaType: 'table',
                areacode: this.tableId,
                rows: saveData
            }
        }
    } else { // 删除时
        let rows = props.editTable.getCheckedRows(this.tableId).map((e)=> e.data);
        // 过滤没pk的数据
        rows = rows.filter((e) => {return !(e.values && e.values[this.primaryId] && e.values[this.primaryId].value == "")} )
        data = {
            pageid: this.pageId,
            templetid: this.tableOid,
            model: {
                areaType: 'table',
                areacode: this.tableId,
                rows: rows
            }
        }
    }
    return data
}

/**
 * ajax请求
 * @param {*} data      传参
 * @param {*} url       接口路径
 * @param {*} callBack  成功回调
 * @param {*} param     可能需要的参数
 */
export function reqAjax(url, data, callBack, param) {
    ajax({
        url: url,
        data: data,
        success: (res) => {
            if( res.success ) {
                callBack && callBack.call(this, res, param);
            }
        }
    });
}

/**
 * 删除编辑态时删掉的数据
 * @param {*} editDelData  编辑态删除了的暂存数据
 * @param {*} path         请求路径
 */
export function delEditData(editDelData, path) {
    // 若在编辑态时，删除了几条数据，先删掉这些数据
    if ( editDelData.model.rows.length != 0 ) {
        reqAjax.call(this, path, editDelData);
        //清空编辑态暂存数据
        this.state.editDelData.model.rows.length = 0;
    }
}

/**
 * 前台删除没被引用的行
 * @param {*} props     页面内置对象
 * @param {*} rows      选中的行数据
 * @param {*} succVOs   返回没被引用的数据
 */
export function delRowsByTable(props, rows, succVOs) {
    // 前台删除没被引用的行
    for ( let i=0;i<rows.length;i++ ) {
        for ( let j=0;j<succVOs.length;j++ ) {
            if( rows[i].values[this.primaryId].value == succVOs[j][this.primaryId] ) {
                this.state.editDelData.model.rows.push( rows[i] );
                props.editTable.deleteTableRowsByRowId(this.tableId, rows[i].rowid );
            }
        }
    }
}

/**
 * 浏览态删除
 * @param {*} checkDelDataLen   选择数据长度
 * @param {*} delData           待删除的数据
 */
export function browseDel(checkDelDataLen, delData) {
    promptBox({
        color: 'warning', 
        title: "删除",
        content: checkDelDataLen == 1 ? '确定要删除吗?' : '确定要删除所选数据吗?',
        beSureBtnClick: () => {
            let isBatch = checkDelDataLen == 1 ? false : true;
            bodyBtnOperation.call(this, delData, this.delUrl, '删除成功!', isBatch);
        }
    });
}

/**
 * 编辑态删除操作
 * @param {*} props     页面内置对象
 * @param {*} len       选中len行数据  
 * @param {*} rows      行数据
 * @param {*} path      请求路径
 * @param {*} oprName   操作名
 */
export function editDel(props, len, rows, path, oprName) {
    let pks = rows && rows.map( e => e.values && e.values[this.primaryId] && e.values[this.primaryId].value );
    // 编辑态删除刚新增没有pk的数据
    if (len) {
        rows.map((e) => {
            if(e.values && e.values[this.primaryId] && e.values[this.primaryId].value == "") {
                props.editTable.deleteTableRowsByRowId(list_table_id,e.rowid);
            }
        })
    }
    let delCallBack = function(res, rows) {
        let { succVOs, failVOs } = res.data;
        if ( failVOs.length !== 0 ) {
            multiToast.call(this, 'del', oprName, res.data);
        }
        if ( succVOs.length !== 0 ) {
            delRowsByTable.call(this, props, rows, succVOs);
        }
    }
    reqAjax.call(this, path, {pks: pks}, delCallBack, rows);
}

/**
 * 必输项校验
 * @param {*} props     页面内置对象
 * @param {*} saveData  待校验数据
 */
export function regRequired(props, saveData) {
    // 名称和编码去掉前后空格
    saveData.map( e => {
        e.values[this.name].value = trimStr(e.values[this.name].value);
        e.values.code.value = trimStr(e.values.code.value);
    });
    // 必输项校验
    // let saveFlag = props.editTable.checkRequired(this.tableId, saveData); // 这方法提示有问题
    let saveFlag = requiredCheck.call(this, saveData); // 自己写的校验方法
    if (!saveFlag) {
        return false;
    }
    return true;
}

/**
 * 校验方法（此为平台方法提示不对的权宜之计）
 * @param {*} saveData  待校验数据
 */
export function requiredCheck(saveData) {
    let { meta } = this.state;
    let toastField = '';
    let isFlag = true;
    // 获取必输字段
    let requiredField = meta[this.tableId] && meta[this.tableId].items.filter(e => {
        if(e.required == true) {
            toastField += ` ${e.label}`;
            return e;
        }
    });
    for(let i=0;i<requiredField.length;i++) {
        for(let j=0;j<saveData.length;j++) {
            if(saveData[j].values[requiredField[i].attrcode].value === '') {
                toast({
                    color: 'danger',
                    title: `出错啦！`,
                    content: `下列字段不能为空:${toastField}`
                });
                isFlag = false;
                return;
            }
        }
    }
    return isFlag
}

/**
 * 判断编辑态是否没有操作
 * @param {*} props  页面内置对象
 */
export function oprFlag(props) {
    let length = props.editTable.getChangedRows(this.tableId,true).length;
    let temDelData = this.state.editDelData.model.rows;
    if( length == 0 && temDelData.length === 0 ) {
        props.editTable.setStatus(this.tableId,'browse');
        listButtonVisible.call(this, props);
        return false;
    }
    return true
}

/**
 * 根据table的状态（browse或edit）渲染页面
 * @param {*} props  页面内置对象
 */
export function listButtonVisible (props) {
    let { getStatus } = props.editTable;
    let { setButtonVisible, setMainButton, setPopContent } = props.button;
    let statusOfTable = getStatus(this.tableId);//获取表格状态（编辑or浏览）
    let isBrowse = statusOfTable === "browse";
    if(isBrowse){
        this.setState({
            showSearch: true
        });
        setButtonVisible({Save:false,Cancel:false,Refresh:true,Edit:true});
        setMainButton('Add', true);
        setPopContent('DelLine', '确定要删除吗?');
        window.onbeforeunload= () => {
            // 可改为卸载事件
		}
    }else{
        this.setState({
            showSearch: false
        });
        setButtonVisible({Save:true,Cancel:true,Refresh:false,Edit:false});
        setMainButton('Add', false);
        setPopContent('DelLine', ''); // content传空，操作列按钮就不会弹出气泡
        window.onbeforeunload= () => {
            return '当前单据未保存, 您确定离开此页面?';
		}
    }
}

/**
 * 列表选择事件，用于通过勾选判断肩部按钮置灰
 * @param {*} props  页面内置对象
 */
export function selectedEvent(props, moduleId, record, index, status) {
    let selectDatas = props.editTable.getCheckedRows(this.tableId);
    let disabledBtn = this.disableBtn.filter(item => item !== 'refresh');
    if (selectDatas.length === 0){
        props.button.setButtonDisabled(disabledBtn, true);
    }else{
        props.button.setButtonDisabled(disabledBtn, false);
    }
}

/**
 * 操作列按钮显隐性控制（单页）
 * @param {*} sys_mark       系统预置数据标识
 * @param {*} enable_status  起停用状态
 * @param {*} page           页面code
 */
export function oprBtnVisible(sys_mark, enable_status, page) {
    let buttonAry = [];
    if(page === '36010LTC_list') { // 授信类别和其他节点相反
        enable_status = enable_status ==='0' ? '1' : '0';
    }
    if(!sys_mark){
        if( enable_status === '1' ) {
            buttonAry = ['DelLine', 'StopLine'];
        } else {
            buttonAry = ['DelLine', 'StartLine'];
        }
    }
    return buttonAry
}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称（与OPR_NAME的键对应）
 * @param {*} OPR_NAME - 操作名称对应的文本 
 * OPR_NAME示例
 * {
        commit: '提交',
        uncommit: '收回',
        delete: '删除'
    }
 * @param {*} data - 接口返回数据
 */
export function multiToast(name, OPR_NAME, data) {
    //这里换成自己接口返回的字段名
    let { successNum, failNum, total, msg, errormessages } = data;
    let content = `共${OPR_NAME[name]}${total}条，成功${successNum}条，失败${failNum}条`;
    if (successNum == total) { //全部成功
        toast({
            duration: 5,
            color: 'success',
            title: `${OPR_NAME[name]}完毕，${msg}`,
            content: content,
            groupOperation: true
        });
    } else if (failNum == total) { //全部失败
        toast({
            duration: 'infinity',
            color: 'danger',
            title: `${OPR_NAME[name]}完毕，${msg}`,
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: ['展开', '收起', '关闭'],
            groupOperationMsg: errormessages, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    } else if (successNum < total) { //部分失败
        toast({
            duration: 'infinity',
            color: 'warning',
            title: `${OPR_NAME[name]}完毕，${msg}`,
            content: content,
            groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
            TextArr: ['展开', '收起', '关闭'],
            groupOperationMsg: errormessages, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
        });
    }
}
/*GKsT8Jv7ysLQ2bKlu6b9T1mHstRNJnHB4ouMERTAM2FhjYzJ4XYpdHBlz9rcn43S*/