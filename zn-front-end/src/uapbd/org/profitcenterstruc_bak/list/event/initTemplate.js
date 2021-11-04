//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax, toast, cacheTools } from 'nc-lightapp-front';
let TableId = 'resapfcs';
const pageId = '10100PFCS_LIST';
let delurl = '/nccloud/uapbd/profitcenterstruc/Delete.do';
export default function (props) {
    let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
            props.createUIDom(
                {
                    pagecode: '10100PFCS_LIST',//页面id
                },
                function (data) {
                    if (data) {
                        if (data.button) {
                            let button = data.button;
                            props.button.setButtons(button);
                        }
                        if (data.template) {
                            debugger
                            let meta = data.template;
                            modifierMeta(props, meta, json);
                            props.meta.setMeta(meta);
                            let hasSearched = cacheTools.get("hasSearched");
                            let searchVal = cacheTools.get("searchParams");
                            let qdata = {
                                pageid: "10100PFCS_LIST",
                                filter: searchVal
                            };
                            debugger
                            ajax({
                                url: "/nccloud/uapbd/profitcenterstruc/ListQuery.do",
                                method: "post",
                                data: qdata,
                                success: function (res) {
                                    if (res.success) {
                                        if (res.data) {
                                            props.editTable.setTableData(TableId, res.data[TableId]);
                                            props.button.setButtonDisabled(['printGrp', 'output'], false);
                                        } else {
                                            props.button.setButtonDisabled(['printGrp', 'output'], true);
                                            toast({ content: this.state.json['10140INCMG-000019'], color: "warning" });/* 国际化处理： 无数据！*/
                                        }
                                    }
                                },
                                error: (res) => {
                                    console.log(res.message);
                                }
                            });

                        }
                    }
                }
            );
        } else {
            console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
        }
    }
    props.MultiInit.getMultiLang({ moduleId: "resa-profitcenter", domainName: 'uapbd', callback })
}

function modifierMeta(props, meta, json) {
    //树表添加操作列
    let event = {
        attrcode: 'opr',
        label: json['10100RESA-000018'],/* 国际化处理： 操作*/
        itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
        width: 200,
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
            let tableBtnAry = ['editline', 'delline','pfcgroup'];
            return (
                props.button.createOprationButton(
                    tableBtnAry,
                    {
                        area: "list_inner",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => tableButtonClick(props, record.values.pk_pfconstruct.value, id, record)
                    }
                )
            )
        }
    };
    meta[TableId].items.push(event);
    return meta;
}

function tableButtonClick(props, key, id, record) {
    debugger
    switch (id) {
        case 'Editline'://修改利润中心统计体系
    
            break;
        case 'Delline'://删除
            ajax({
                url: delurl,
                data: { pk_pfconstruct: key, ts: record.values.ts.value },
                success: (res) => {
                    toast({ color: 'success', title: props.MutiInit.getIntl("10140INCMG") && props.MutiInit.getIntl("10140INCMG").get('10140INCMG-000015') }) //this.state.json['10140INCMG-000015'],/* 国际化处理： 删除成功！*/
                    props.editTable.deleteTableRowsByIndex(tableId, index);
                    let tableData = props.editTable.getAllTableData(tableId).rows;
                    let selectData = props.editTable.getCheckedRows(tableId);
                    if (selectData && selectData.length > 0) {
                        //行删除之后，如果没有勾选的数据，那么删除按钮置灰
                        props.button.setButtonDisabled(['delete'], false);
                    } else {
                        //行删除之后，如果没有勾选的数据，那么删除按钮置灰
                        props.button.setButtonDisabled(['delete'], true);
                    }
                    if (tableData && tableData.length > 0) {
                        props.button.setButtonDisabled(['printGrp', 'output'], false);
                    } else {
                        props.button.setButtonDisabled(['printGrp', 'output'], true);
                    }
                }
            });
            break;
        case 'pfcgroup'://跳转到利润中心组
            props.pushTo('/card', {
                status: 'browse',
                pk_pfconstruct: key,
                pagecode: pageId,
            });
        default:
            break;

    }

}
//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX