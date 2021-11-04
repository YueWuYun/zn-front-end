//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, promptBox, cardCache, toast } from 'nc-lightapp-front';
import toggleShow from './toggleShow';
import { queryCard, SaveBill, loadPageValue, initAdd, onPrint, onOutput,openFile,exportcFun,openBillTrack} from './costCompStruc';
import pageInfoClick from './pageInfoClick';
import { pkname, formId, dataSource, pagecode, tableId } from '../constants';
import { headButton } from '../../../../public/excomponents/pubUtils/buttonName.js';

/**
 * 表头肩部按钮处理方法
 */


export default function (props, id) {
    let that = this;
    let newid = id;
    let { getCurrentLastId, getCacheById, getNextId, deleteCacheById } = cardCache;
    switch (newid) {
        //新增
        case headButton.Add:
            initAdd(that, false);
            break;
        //取消
        case headButton.Cancel:
            promptBox({
                color: "warning", title: that.state.json['10140CCSC-000010'], content: that.state.json['10140CCSC-000009'], beSureBtnClick: function () {
                    var id = props.getUrlParam('id');
                    if (id === "undefined" || id == undefined) {
                        id = getCurrentLastId(dataSource);
                    }
                    let cardData = getCacheById(id, dataSource);
                    if (cardData) {
                        loadPageValue(cardData, props);
                        props.setUrlParam({ status: 'browse' });
                        toggleShow(that, props);
                    }
                    else {
                        //新增状态，列表界面无数据
                        if (id === "undefined" || id == undefined) {
                            props.form.EmptyAllFormValue(formId);
                            props.cardTable.setMulTablesData({ [tableId]: { rows: [] } });
                            if (props.getUrlParam('status') === "undefined" || props.getUrlParam('status') == undefined) {
                                props.addUrlParam({ status: 'browse' });
                            } else {
                                props.setUrlParam({ status: 'browse' });
                            }
                            toggleShow(that, props);
                        }
                        else {
                            //新增状态，列表界面有数据 || 列表及卡片的复制
                            if (props.getUrlParam('status') === 'add' || props.getUrlParam('status') === 'copy') {
                                props.setUrlParam({ status: 'browse' });
                                pageInfoClick(props, id, that);//此方法涉及页面按钮处理
                            }
                            else {
                                //列表或者卡片的修改
                                props.form.cancel(formId);
                                props.cardTable.resetTableData(tableId);
                                props.setUrlParam({ status: 'browse' });
                                toggleShow(that, props);
                            }
                        }
                    }
                }
            });
            break;
        //保存
        case headButton.Save:
            SaveBill.call(that, that.props);
            break
        //删除
        case headButton.Delete:
            let delObjs = [];
            delObjs.push({
                pk_bill: props.form.getFormItemsValue(formId, pkname).value,
                ts: props.form.getFormItemsValue(formId, "ts").value,
                index: 0,
                pageId: pagecode
            });
            promptBox({
                color: "warning",
                title: that.state.json['10140CCSC-000004'],
                content: that.state.json['10140CCSC-000005'],/* 国际化处理： 确定要删除吗？*/
                beSureBtnClick: function () {
                    ajax({
                        url: '/nccloud/uapbd/costcompstruc/delete.do',
                        data: delObjs,
                        success: (res) => {
                            if(res.data.messageCard)
                            {
                                toast({ color: 'danger', content: res.data.messageCard });//删除失败信息
                                return;
                            }
                            else
                            {
                                toast({ color: 'success', content: that.state.json['10140CCSC-000006'] });/* 国际化处理： 删除成功*/
                            }
                            var id = props.getUrlParam('id');
                            var nextId = getNextId(id, dataSource);
                            deleteCacheById(pkname, id, dataSource);
                            var cardData = getCacheById(nextId, dataSource);
                            if (cardData) {
                                loadPageValue(cardData, props);
                                toggleShow(that, props);
                                props.setUrlParam({ id: nextId });
                            }
                            else {
                                pageInfoClick(props, nextId, that);
                                toggleShow(that, props);
                            }
                        }
                    });
                }
            })
            break
        //编辑
        case headButton.Edit:
            props.setUrlParam({ status: 'edit' });
            queryCard.call(that, props);
            break;
        //复制
        case headButton.Copy:
            props.setUrlParam({ status: 'copy' });
            queryCard.call(that, props);
            break;
        //刷新
        case headButton.Refresh:
            props.setUrlParam({ status: 'refresh' });
            queryCard.call(that, props);
            toast({ color: 'success', title: that.state.json['200401APM-000033'] });/* 国际化处理： 刷新成功*/
            break;
        //打印
        case headButton.Print:
            onPrint(that, props);
            break;
        // 输出
        case headButton.Output:
            onOutput(that, props);
            break;
	    case headButton.ImportData: //导入
                break;
        case headButton.ExportData: //导出
                exportcFun(that,props);
                break;
        //附件上传
        case headButton.AttachManage:
            openFile(that,props);
            break;
        //联查单据
		case headButton.BillLinkQuery:
			openBillTrack(that,props);
            break;
        case headButton.Distribution:
            this.isModalShow();
            break;
        case headButton.CancelDistri:
            this.cancelModalShow();
            break;
        default:
            break
    }
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS