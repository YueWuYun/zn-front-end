/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { createPage, ajax, base, toast, print, output, promptBox } from 'nc-lightapp-front';
const { NCMessage } = base;

import { 
    app_id, module_id, base_url, button_limit,
    oid, appcode, printnodekey,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';

export default function buttonClick(props, id) {
    switch (id) {
        //新增
		case 'add':
            props.pushTo("/card", {
                status: 'add',
                pagecode: card_page_id,
            })
            break;
            const editData = props.table.getCheckedRows(this.tableId);
            if (editData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000034') });	/* 国际化处理： 请选择1条数据*/
                return;
            }
            let editId = 0;
            editData.forEach((val) => {
                //主键
                editId = val.data.values.pk_accid.value;
            });
            props.pushTo("/card", {
                status: 'edit',
                id: editId,
                pagecode: card_page_id,
            })
            break;
        //删除，可以支持批量
        case 'delete':
            const selectedData = props.table.getCheckedRows(this.tableId);
            if (selectedData.length == 0) {
                /* 国际化处理： 请选择数据*/
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC")
                 && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000035') });
                return;
            }else{
                let deleteContent;
                if (selectedData.length > 1) {
                    // 确定要删除所选数据吗?
                    deleteContent = this.props.MutiInit.getIntl("36010IACC")
                     && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000049');
                }else{
                    /* 国际化处理： 确认是否删除？*/
                    deleteContent = this.props.MutiInit.getIntl("36010IACC")
                     && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000022');
                }
                // this.props.modal.show('deleteModal');
                promptBox({
                    color: "warning",
                    title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000021'),/* 国际化处理： 删除*/
                    content: deleteContent,
                    //点击确定按钮事件
                    // beSureBtnClick: buttonClick.bind(this, props, 'deleteConfirm')
                    beSureBtnClick: this.delConfirm.bind(this)
                });
            }
            break;
        //复制
        case 'copy':
            let copyData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (copyData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000034') });	/* 国际化处理： 请选择1条数据*/
                return
            }
            let copyid =0;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_accid.value;
            });
            props.pushTo("/card", {
                status: 'copy',
                id: copyid,
                pagecode: card_page_id,
            });
            break;
        // 刷新
        case 'refresh':
            refreshHtml(props);
            break;
        // 附件管理
        case 'file':
            let fileselectedData = props.table.getCheckedRows(this.tableId);
            if (fileselectedData.length != 1) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000036') });/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            let pk_accid_file,vbillno_file;
            fileselectedData.forEach((val) => {
                pk_accid_file = val.data.values.pk_accid.value;
                vbillno_file = val.data.values.accidcode.value;
            });
            this.setState({
                showUploader: !this.state.showUploader,
                billID: pk_accid_file,
                billNO: vbillno_file
            });
            break;
        // 打印
        case 'print':
            let printselectedData = props.table.getCheckedRows(this.tableId);
            if (printselectedData.length <= 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000037') });/* 国际化处理： 请选择数据操作！*/
                return;
            }
            let pk_accid_print = [];
            printselectedData.forEach((val) => {
                pk_accid_print.push(val.data.values.pk_accid.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/tmpub/tmbd/acciddprint.do',
                {
                    // printTemplateID: '1001Z61000000002JHZT',
                    //功能节点编码，即模板编码
                    appcode: appcode,
                    // 模板节点标识
                    nodekey: printnodekey,
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: pk_accid_print
                }
            );  
            break;
        // 输出
        case 'output':
            let outputselectedData = props.table.getCheckedRows(this.tableId);
            if (outputselectedData.length <= 0) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000037') });/* 国际化处理： 请选择数据操作！*/
                return;
            }
            let pk_accid_output = [];
            outputselectedData.forEach((val) => {
                pk_accid_output.push(val.data.values.pk_accid.value);
            });
            output({
                url: '/nccloud/tmpub/tmbd/acciddprint.do',
                data: {
                    //功能节点编码，即模板编码
                    appcode: appcode,
                    // 模板节点标识
                    nodekey: printnodekey,
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: pk_accid_output,
                    outputType: 'output'
                }
            });
            break;
        default:
            break;
    }
};
//刷新列表信息
function refreshHtml(props) {
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    //查询condition
    let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid= queryInfo.oid;
    if(refreshsearchVal && refreshsearchVal.conditions){
        let data = {
            querycondition: refreshsearchVal,
            conditions: refreshsearchVal && refreshsearchVal.conditions,
            pageInfo: refreshpageInfo,
            pagecode: list_page_id,
            //查询区编码
            queryAreaCode: list_search_id,
            //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
            oid: oid,  
            querytype: 'tree',
        };
        ajax({
            url: '/nccloud/tmpub/tmbd/accidquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(list_table_id, data[list_table_id]);
                    } else {
                        props.table.setAllTableData(list_table_id, { rows: [] });
                    }
                }
            }
        });   
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/