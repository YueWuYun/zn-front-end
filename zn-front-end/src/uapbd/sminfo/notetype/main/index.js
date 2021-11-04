//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 票据类型
 * @author	zouj
 */
import {
    ajax,
    base,
    createPage,
    createPageIcon,
    getMultiLang,
    high,
    print,
    promptBox,
    toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Utils from "../../../public/utils";
import "./index.less";
const { PrintOutput } = high;
const { NCDiv } = base;

const tableid = "notetypecode";
const pagecode = "10140NDTY_notetype";
const appcode = "10140NDTY";
const urls = {
    save: "/nccloud/uapbd/notetype/notetypesave.do",
    query: "/nccloud/uapbd/notetype/notetypequery.do",
    queryTemplet: "/nccloud/platform/templet/querypage.do",
    print: "/nccloud/uapbd/notetype/notetypeprint.do"
};
const isShowOffEnable = true; //是否启用“显示停用”功能
let allTableData = {};
let hasData = false; // 列表是否有数据
const keys = ["pk_org", "noteclass", "noteattr", "timeunit", "enablestate"]; //过来空行时，忽略的字段

//获取并初始化模板
let initTemplate = props => {
    props.createUIDom(
        {
            pagecode: pagecode
        },
        data => {
            let meta = data.template;
            meta = modifierMeta(props, meta);
            props.meta.setMeta(meta);
            data.button && props.button.setButtons(data.button);
            props.button.setPopContent(
                "DelLine",
                props.MutiInit.getIntl("10140NDTY") &&
                    props.MutiInit.getIntl("10140NDTY").get("10140NDTY-000000")
            ); /* 设置操作列上删除按钮的弹窗提示 */
            props.button.setButtonsVisible({
                Add: true,
                Edit: true,
                Delete: true,
                Save: false,
                Cancel: false,
                Refresh: true,
                Print: true,
                Output: true
            });
            // 初始化时删除按钮不可用
            props.button.setButtonDisabled({
                Delete: true,
                Print: !hasData,
                Output: !hasData
            });
        }
    );
};

//对表格模板进行加工操作
function modifierMeta(props, meta) {
    //添加表格操作列
    let event = {
        label:
            props.MutiInit.getIntl("10140NDTY") &&
            props.MutiInit.getIntl("10140NDTY").get(
                "10140NDTY-000001"
            ) /* 国际化处理： 操作*/,
        attrcode: "opr",
        key: "opr",
        itemtype: "customer",
        visible: true,
        fixed: "right",
        render(text, record, index) {
            return props.button.createOprationButton(["DelLine"], {
                area: "table-opr-area",
                buttonLimit: 3,
                onButtonClick: (props, id) =>
                    tableButtonClick(props, id, text, record, index)
            });
        }
    };
    meta[tableid].items.push(event);
    //props.renderItem('table',tableid,'creator',refer('creator'));
    return meta;
}
function tableButtonClick(props, id, text, record, index) {
    switch (id) {
        case "DelLine":
            if (props.editTable.getStatus(tableid) === "edit") {
                //编辑状态
                props.editTable.deleteTableRowsByIndex(tableid, index);
            } else {
                //浏览态
                let delObj = {
                    rowId: index,
                    status: "3",
                    values: {}
                };
                if (record.values.enablestate.value === true) {
                    record.values.enablestate.value = "2";
                } else {
                    record.values.enablestate.value = "3";
                }
                delObj.values = record.values;
                let indexArr = [];
                indexArr.push(index);
                let data = {
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: [delObj]
                    }
                };
                ajax({
                    url: urls["save"],
                    data,
                    success: function(res) {
                        let { success, data } = res;
                        if (success) {
                            props.editTable.deleteTableRowsByIndex(
                                tableid,
                                indexArr
                            );
                            let allD = props.editTable.getAllData(tableid);
                            Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
                            props.editTable.setTableData(tableid, allD);
                            allTableData = allD;
                            toast({
                                content:
                                    props.MutiInit.getIntl("10140NDTY") &&
                                    props.MutiInit.getIntl("10140NDTY").get(
                                        "10140NDTY-000002"
                                    ),
                                color: "success"
                            }); /* 国际化处理： 删除成功*/
                        }
                    }.bind(this)
                });
            }
        default:
            break;
    }
}
class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.props.button.setButtonsVisible({
            Add: false,
            Edit: false,
            Save: false,
            Cancel: false,
            Delete: false
        });
        this.state = {
            searchValue: "",
            searchDisable: false, //简单搜索框是否禁用	true：禁用		false：可用
            showOffDisable: false, //显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff: false, //列表是否显示停用数据
            json: {}
        };
    }
    componentDidMount() {
        this.getData(false);
    }
    componentWillMount() {
        let callback = json => {
            // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            this.setState({ json }); // 保存json和inlt到页面state中并刷新页面
        };
        getMultiLang({ moduleId: appcode, domainName: "uapbd", callback });
    }
    componentDidUpdate() {
        let tableStatus = this.props.editTable.getStatus(tableid);
        if (tableStatus != "add" && tableStatus != "edit") {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {
                //编辑态关闭页签或浏览器的提示
                return "";
            };
        }
    }
    //请求列表数据
    getData = callback => {
        let showOff = this.state.isShowOff;
        //mazheng 重构代码, 设置查询参数
        var param = {
            pagecode: pagecode,
            showOff: this.state.isShowOff
        };

        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls["query"],
            data: param,
            success: res => {
                let { success, data } = res;
                if (success) {
                    Utils.handleTableReData({
                        data: data,
                        tableid: tableid,
                        props: this.props,
                        empty: data => {
                            //数据为空时执行回调方法
                            this.props.editTable.setTableData(tableid, {
                                rows: []
                            });
                        },
                        notEmpty: data => {
                            //数据不为空时执行回调方法
                            //适配显示公式
                            Utils.showFormular(this.props, res, {
                                tableid: "editTable"
                            });
                            //是否启用转换成开关
                            Utils.convertGridEnablestateToShow(
                                data[tableid].rows
                            );
                            this.props.editTable.setTableData(
                                tableid,
                                data[tableid]
                            );
                            hasData = true;

                            this.props.button.setDisabled({
                                Print: !hasData,
                                Output: !hasData
                            });
                        },
                        after: data => {
                            //数据处理完成后执行回调方法
                            allTableData = data[tableid];
                            callback && callback();
                        }
                    });
                }
            }
        });
    };
    onChangeEnableValue() {}
    // 启用，停用，确定调用的方法
    onEnableConfirmModal(
        props,
        moduleId,
        key,
        changerows,
        value,
        index,
        data
    ) {}
    //表格编辑后事件
    onAfterEvent(props, moduleId, key, changerows, value, index, data) {
        if (key === "enablestate") {
            let rowData = Utils.clone(data);
            rowData.status = "1";
            if (rowData.values["enablestate"].value) {
                rowData.values["enablestate"].value = "2";
            } else {
                rowData.values["enablestate"].value = "3";
            }
            let reqData = [];
            reqData.push(rowData);
            let changDdata = {
                pageid: pagecode,
                model: {
                    areaType: "table",
                    pageinfo: null,
                    rows: reqData
                }
            };
            ajax({
                url: urls["save"],
                data: changDdata,
                success: res => {
                    //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success, data } = res;
                    if (success) {
                        //操作成功，更新页面当前行数据
                        let allD = this.props.editTable.getAllData(tableid);
                        Utils.convertGridEnablestateToShow(data[tableid].rows);
                        Utils.filterResult(allD, data[tableid].rows); //将保存后返回的数据重新放置到页面
                        this.props.editTable.setTableData(tableid, allD);
                    } else {
                        if (key === "enablestate") {
                            this.props.editTable.setValByKeyAndIndex(
                                tableid,
                                data.rowId,
                                "enablestate",
                                { value: !data.values["enablestate"].value }
                            );
                        }
                    }
                }
            });
            return;
        }
    }

    //更新按钮状态
    updateButtonStatus() {
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length; //获取列表页选择数据的行数
        if (length === 0) {
            //未选择数据
            this.props.button.setDisabled({
                Delete: true
            });
        } else if (length === 1) {
            //选择一行数据
            this.props.button.setDisabled({
                Delete: false
            });
        } else {
            //选择多行数据
            this.props.button.setDisabled({
                Delete: false
            });
        }
        if (this.props.editTable.getStatus(tableid) === "edit") {
            //编辑状态
            this.props.button.setButtonsVisible({
                Add: true,
                Edit: false,
                Save: true,
                Cancel: true,
                Delete: true,
                Refresh: false,
                Print: false,
                Output: false
            });
            this.setState({
                searchDisable: true,
                showOffDisable: true
            });
            this.props.button.setMainButton({ Save: true, Add: false });
            this.props.button.setPopContent("DelLine", "");
        } else {
            //浏览态
            this.props.button.setButtonsVisible({
                Add: true,
                Edit: true,
                Delete: true,
                Save: false,
                Cancel: false,
                Refresh: true,
                Print: true,
                Output: true
            });
            this.setState({
                moreButton: true,
                searchDisable: false,
                showOffDisable: false
            });
            let hastableData = this.props.editTable.getAllData(tableid);
            if (hastableData.rows.length === 0) {
                hasData = false;
            } else {
                hasData = true;
            }
            this.props.button.setDisabled({
                Print: !hasData,
                Output: !hasData
            });
            this.props.button.setMainButton({ Save: false, Add: true });
            this.props.button.setPopContent(
                "DelLine",
                this.state.json["10140NDTY-000000"]
            ); /* 国际化处理： 确认要删除该信息吗？*/
        }
    }

    //显示停用数据
    showOffChange() {
        this.setState({
            isShowOff: !this.state.isShowOff
        });
        setTimeout(() => {
            this.getData(() => {
                this.onSearch(this.state.searchValue);
            });
        }, 10);
    }

    cancelConfirmModal(props) {
        this.props.editTable.cancelEdit(tableid);
        this.props.editTable.showColByKey(tableid, "opr"); //显示操作列
        this.updateButtonStatus();
    }
    //按钮点击事件
    onButtonClick(props, id) {
        switch (id) {
            case "Add":
                let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                this.setStatus(this.props, tableid, "add");
                this.props.editTable.addRow(tableid, num, true);
                this.props.editTable.setValByKeyAndIndex(
                    tableid,
                    num,
                    "enablestate",
                    { value: "2" }
                ); //设置是否启用默认值
                this.props.editTable.setValByKeyAndIndex(
                    tableid,
                    num,
                    "pk_org",
                    {
                        value: "GLOBLE00000000000000",
                        display: this.state.json["10140NDTY-000003"]
                    }
                ); //设置组织默认值/* 国际化处理： 全局*/
                this.props.editTable.setValByKeyAndIndex(
                    tableid,
                    num,
                    "noteclass",
                    { value: "8", display: this.state.json["10140NDTY-000004"] }
                ); //设置组织默认值/* 国际化处理： 其他*/
                this.props.editTable.setValByKeyAndIndex(
                    tableid,
                    num,
                    "noteattr",
                    { value: "0", display: this.state.json["10140NDTY-000005"] }
                ); //设置组织默认值/* 国际化处理： 其他票据*/
                this.props.editTable.setValByKeyAndIndex(
                    tableid,
                    num,
                    "timeunit",
                    { value: "3", display: this.state.json["10140NDTY-000006"] }
                ); //设置组织默认值/* 国际化处理： 日*/
                break;
            case "Edit":
                // 转换enablestate
                this.setStatus(this.props, tableid, "edit");
                break;
            case "Cancel":
                promptBox({
                    color: "warning", // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json[
                        "10140NDTY-000007"
                    ] /* 国际化处理： 确认取消*/,
                    content: this.state.json[
                        "10140NDTY-000008"
                    ] /* 国际化处理： 是否确认要取消？*/,
                    beSureBtnClick: () => {
                        this.cancelConfirmModal();
                    }
                });
                break;
            case "Save":
                setTimeout(() => {
                    this.props.editTable.filterEmptyRows(tableid, keys);
                    let tableData = this.props.editTable.getChangedRows(
                        tableid,
                        true
                    ); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                    if (!tableData || tableData.length === 0) {
                        this.props.editTable.cancelEdit(
                            tableid,
                            this.updateButtonStatus.bind(this)
                        );
                        toast({
                            title: this.state.json["10140NDTY-000009"],
                            color: "success"
                        }); /* 国际化处理： 保存成功！*/
                        return;
                    }
                    let tableAllData = this.props.editTable.getAllRows(
                        tableid,
                        true
                    );
                    if (
                        !this.props.editTable.checkRequired(
                            tableid,
                            tableAllData
                        )
                    )
                        return;
                    let data = {
                        pageid: pagecode,
                        model: {
                            areaType: "table",
                            pageinfo: null,
                            rows: [],
                            areacode: tableid //添加表单的areacode编码
                        }
                    };
                    data.model.rows = tableData;
                    // 验证公式
                    this.props.validateToSave(
                        data,
                        () => {
                            ajax({
                                url: urls["save"],
                                data,
                                success: function(res) {
                                    //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                    let { success, data } = res;
                                    if (success) {
                                        // 转换enablestate
                                        this.setStatus(
                                            this.props,
                                            tableid,
                                            "browse"
                                        ); //设置表格状态为浏览态
                                        // this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
                                        Utils.handleTableReData({
                                            data: data,
                                            tableid: tableid,
                                            props: this.props,
                                            empty: data => {
                                                //数据为空时执行回调方法
                                            },
                                            notEmpty: data => {
                                                //数据不为空时执行回调方法
                                                let allD = this.props.editTable.getAllData(
                                                    tableid
                                                );
                                                Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
                                                Utils.convertGridEnablestateToShow(
                                                    data[tableid].rows
                                                );
                                                Utils.filterResult(
                                                    allD,
                                                    data[tableid].rows
                                                ); //将保存后返回的数据重新放置到页面
                                                this.props.editTable.setTableData(
                                                    tableid,
                                                    allD
                                                );
                                                hasData = true;
                                                this.updateButtonStatus();
                                            },
                                            after: data => {
                                                //数据处理完成后执行回调方法
                                                let allD = this.props.editTable.getAllData(
                                                    tableid
                                                );
                                                allTableData = allD;
                                            }
                                        });
                                        toast({
                                            title: this.state.json[
                                                "10140NDTY-000009"
                                            ],
                                            color: "success"
                                        }); /* 国际化处理： 保存成功！*/
                                    }
                                }.bind(this)
                            });
                        },
                        { [tableid]: "editTable" }
                    );
                }, 0);
                break;
            case "Delete":
                let selectedData = this.props.editTable.getCheckedRows(tableid);
                if (selectedData.length == 0) {
                    toast({
                        content: this.state.json["10140NDTY-000010"],
                        color: "warning"
                    }); /* 国际化处理： 请选择要删除的数据*/
                    return;
                }
                if (this.props.editTable.getStatus(tableid) === "edit") {
                    //编辑状态
                    let indexArr = [];
                    selectedData.forEach(val => {
                        indexArr.push(val.index);
                    });
                    this.props.editTable.deleteTableRowsByIndex(
                        tableid,
                        indexArr
                    );
                } else {
                    promptBox({
                        color: "warning", // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.state.json[
                            "10140NDTY-000011"
                        ] /* 国际化处理： 删除提醒*/,
                        // content:'确定要删除数据吗？',
                        content: this.state.json[
                            "10140NDTY-000012"
                        ] /* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/,
                        beSureBtnClick: () => {
                            this.onDelForBrowse();
                        }
                    });
                }
                break;
            case "Refresh":
                this.setState({ searchValue: "" });
                this.getData();
                toast({
                    title: this.state.json["10140NDTY-000013"],
                    color: "success"
                }); /* 国际化处理： 刷新成功！*/
                break;

            case "Print":
                this.output("print");
                break;
            case "Output":
                this.output("output");
                break;
        }
    }

    output(type = "") {
        let allData = this.props.editTable.getAllData(tableid);
        let pks = [];
        allData.rows.forEach(item => {
            pks.push(item.values["pk_notetype"].value);
        });
        if (type === "print") {
            //打印
            print(
                "pdf", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                urls["print"],
                {
                    billtype: "", //单据类型
                    funcode: appcode, //功能节点编码，即模板编码
                    nodekey: "", //模板节点标识
                    oids: pks //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                }
            );
        }

        //输出
        if (type === "output") {
            this.setState(
                {
                    pks: pks
                },
                this.refs.printOutput.open()
            );
        }
    }
    onSelectMoreButton({ key }) {
        toast({
            content: this.state.json["10140NDTY-000014"],
            color: "warning"
        }); /* 国际化处理： 努力开发中......*/
    }

    //表头简单筛选
    onSearch(value) {
        this.setState({ searchValue: value });
        let allData = Utils.clone(allTableData);
        if (value.trim() === "") {
        } else {
            let rows = Array.of();
            for (var row of allData.rows) {
                if (
                    row.values["code"].value.indexOf(value) > -1 ||
                    row.values["name"].value.indexOf(value) > -1
                ) {
                    rows.push(row);
                }
            }
            allData.rows = rows;
        }
        this.props.editTable.setTableData(tableid, allData);
        if (allData.rows.length === 0) {
            hasData = false;
        } else {
            hasData = true;
        }
        // 查询后设置打印等按钮状态
        this.props.button.setButtonDisabled({
            Print: !hasData,
            Output: !hasData
        });
    }
    // 删除时当前行处理
    convertDelEnablestate(item) {
        if (item.values.enablestate.value === true) {
            item.values.enablestate.value = "2";
        } else {
            item.values.enablestate.value = "3";
        }
    }
    //浏览态确认删除事件
    onDelForBrowse() {
        let selectedData = this.props.editTable.getCheckedRows(tableid);
        let indexArr = [];
        let dataArr = [];
        selectedData.forEach(val => {
            this.convertDelEnablestate(val.data);
            let delObj = {
                status: "3",
                values: {}
            };
            delObj.rowId = val.data.rowId;
            delObj.values = val.data.values;
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        let data = {
            pageid: pagecode,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: dataArr
            }
        };
        ajax({
            url: urls["save"],
            data,
            success: function(res) {
                //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(
                        tableid,
                        indexArr
                    );
                    let allD = this.props.editTable.getAllData(tableid);
                    Utils.filterDelRows(allD.rows); //过滤清除删除状态的行
                    this.props.editTable.setTableData(tableid, allD);
                    allTableData = allD;
                    toast({
                        title: this.state.json["10140NDTY-000015"],
                        color: "success"
                    }); /* 国际化处理： 删除成功！*/
                    this.updateButtonStatus();
                }
            }.bind(this)
        });
    }
    // 自动增行后的回调
    addRowAutoCallback() {
        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        this.props.editTable.setValByKeyAndIndex(
            tableid,
            num - 1,
            "enablestate",
            { value: "2" }
        ); //设置是否启用默认值
        // this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'enablestate', {value: true});//设置是否启用默认值
        this.props.editTable.setValByKeyAndIndex(tableid, num - 1, "pk_org", {
            value: "GLOBLE00000000000000",
            display: this.state.json["10140NDTY-000003"]
        }); //设置组织默认值/* 国际化处理： 全局*/
        this.props.editTable.setValByKeyAndIndex(
            tableid,
            num - 1,
            "noteclass",
            { value: "8", display: this.state.json["10140NDTY-000004"] }
        ); //设置组织默认值/* 国际化处理： 其他*/
        this.props.editTable.setValByKeyAndIndex(tableid, num - 1, "noteattr", {
            value: "0",
            display: this.state.json["10140NDTY-000005"]
        }); //设置组织默认值/* 国际化处理： 其他票据*/
        this.props.editTable.setValByKeyAndIndex(tableid, num - 1, "timeunit", {
            value: "3",
            display: this.state.json["10140NDTY-000006"]
        }); //设置组织默认值/* 国际化处理： 日*/
    }

    setStatus(props, tableid, status) {
        let all = this.props.editTable.getAllRows(tableid);
        let tableStatus = this.props.editTable.getStatus(tableid);

        //设置编辑态
        if (status == "add" || status == "edit") {
            //当前组件不是编辑态时才执行转换
            if (tableStatus != "add" && tableStatus != "edit") {
                props.editTable.setStatus(tableid, status);
                let convertAll = Utils.convertGridEnablestateToSave(all);
                props.editTable.setTableData(tableid, { rows: convertAll });
            }
        } else {
            let convertAll = Utils.convertGridEnablestateToShow(all);
            this.props.editTable.setTableData(tableid, { rows: convertAll });
            props.editTable.setStatus(tableid, status);
        }
    }
    render() {
        let { button, editTable, modal, BillHeadInfo } = this.props;
        let { createEditTable } = editTable;
        let { createButtonApp } = button;
        let { NCFormControl, NCCheckbox } = base;
        let { createBillHeadInfo } = BillHeadInfo;
        let { createModal } = modal;
        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-singleTable-header-area"
                >
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: this.state.json[
                                "10140NDTY-000027"
                            ] /* 国际化处理： 票据类型*/,
                            initShowBackBtn: false
                        })}
                        {/* 简单查询 */}
                        <div className="title-search-detail">
                            <NCFormControl
                                placeholder={
                                    this.state.json[
                                        "10140NDTY-000016"
                                    ] /* 国际化处理： 请输入编码或名称筛选*/
                                }
                                value={this.state.searchValue}
                                onChange={this.onSearch.bind(this)}
                                type="search"
                                disabled={this.state.searchDisable}
                            />
                        </div>
                        {/* 显示停用数据 */}
                        <div className="title-search-detail">
                            {isShowOffEnable && (
                                <span className="showOff">
                                    <NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >
                                        {
                                            this.state.json[
                                                "10140NDTY-000028"
                                            ] /* 国际化处理： 显示停用*/
                                        }
                                    </NCCheckbox>
                                </span>
                            )}
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: "list_head",
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector(
                                ".header-button-area"
                            )
                        })}
                    </div>
                </NCDiv>
                {/* 列表区 */}
                <NCDiv
                    fieldid="ncc"
                    areaCode={NCDiv.config.List}
                    className="nc-singleTable-table-area"
                >
                    {createEditTable(tableid, {
                        //列表区
                        onAfterEvent:this.onAfterEvent.bind(this), // 控件的编辑后事件
                        useFixedHeader:true,
                        selectedChange:this.updateButtonStatus.bind(this), // 选择框有变动的钩子函数
                        statusChange: function() {
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0);
                        }.bind(this), //表格状态监听
                        showIndex:true, //显示序号
                        adaptionHeight:true,//空白自动扩充
                        isAddRow:true, // 失去焦点是否自动增行
                        addRowCallback:this.addRowAutoCallback.bind(this), // 自动增行后的回调
                        showCheck:true //显示复选框
                        //params: 'test',                                  // 自定义传参
                    })}
                </NCDiv>
                {createModal("modalEnable", { noFooter: false })}
                <PrintOutput
                    ref="printOutput"
                    url={urls["print"]}
                    data={{
                        funcode: appcode, //功能节点编码，即模板编码
                        nodekey: "", //模板节点标识
                        oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                />
            </div>
        );
    }
}

SingleTable = createPage({
    // 适配公式
    billinfo: {
        billtype: "grid",
        pagecode: pagecode,
        bodycode: tableid
    },
    initTemplate: initTemplate,
    mutiLangCode: appcode
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector("#app"));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65