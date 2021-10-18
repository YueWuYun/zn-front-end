/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
import { ajax, toast, cardCache } from "nc-lightapp-front";
import {
    getListData,
    listRender,
    toggleListHeadBtnDisabled
} from "../../../container/page";
let { setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export function searchBtnClick(props, condition, type, querycondition) {
    if (condition) {
        //将查询条件放入缓存中
        setDefData(
            this.searchCache.key,
            this.searchCache.dataSource,
            condition
        );
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        let searchdata = this.props.search.getQueryInfo(this.searchId);
        pageInfo.pageIndex = 0;
        searchdata.pageCode = this.pageId;
        searchdata.pageInfo = pageInfo;
        //根据页签状态添加自定义查询条件
        if (this.state.activeTab && this.state.activeTab !== "all") {
            let key = this.state.activeTab;
            let tabs = this.tabStatus;
            let conditions = [];
            if (tabs && tabs[key]) {
                let tabfield = tabs[key];
                if (tabfield) {
                    // 是否多字段
                    let fields = tabfield.split(",");
                    for (let index = 0; index < fields.length; index++) {
                        let field = fields[index];
                        let fieldvalue = this[field];
                        let opr = "=";
                        if (fieldvalue && fieldvalue.split(",").length > 1) {
                            // 代表是多个数，需要in
                            opr = "in";
                        }
                        let cuscondition = {
                            field: field,
                            oprtype: opr,
                            value: {
                                firstvalue: fieldvalue,
                                secondvalue: null
                            }
                        };
                        conditions.push(cuscondition);
                    }
                }
            } else {
                let tabfield = this.billstatus;
                let value = this.state.activeTab;
                let cuscondition = {
                    field: tabfield,
                    oprtype: "=",
                    value: {
                        firstvalue: value,
                        secondvalue: null
                    }
                };
                conditions.push(cuscondition);
            }
            searchdata.custcondition = {
                logic: "and",
                conditions
            };
            //额度管理待提交去除经办
            if (this.state.activeTab && this.state.activeTab === "-1" && this.pageId === "36185515_LIST" ) {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [
                        {
                            field: "vbillstatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "-1"
                                //secondvalue: null
                            }
                        },
                        {
                            field: "busistatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "1"
                                //secondvalue: null
                            }
                        }
                    ]
                };
            }
            // 池内质押页签包含发送指令和解除质押指令状态为不明或失败且未作废的
            if (this.state.activeTab.indexOf("cmd") >= 0) {
                let querystatus = this.state.activeTab.substring(3);
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [
                        {
                            field: "disableflag",
                            value: {
                                firstvalue: "N",
                                secondvalue: null
                            },
                            oprtype: "=",
                            display:'',
                            datatype:'1'
                        },
                        {
                            field: "paymentstatus",
                            oprtype: "in",
                            value: {
                                firstvalue: querystatus,
                                secondvalue: null
                            },
                            logic: "or",
                            conditions: [
                                {
                                    field: "backimpawnstatus",
                                    oprtype: "in",
                                    value: {
                                        firstvalue: querystatus,
                                        secondvalue: null
                                    }
                                }
                            ]
                        }
                    ]
                };
            }

            //额度申请的待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
            if (this.state.activeTab.indexOf("36180QADWT") >= 0) {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [
                        {
                            field: "vbillstatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "1"
                                //secondvalue: null
                            }
                        },
                        {
                            field: "busistatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "1"
                                //secondvalue: null
                            }
                        }
                    ]
                };
                let IS36180QADWT = {'IS36180QADWT':true};
                searchdata.userdefObj = IS36180QADWT;
            }
             //待委托办理页签需要是审批通过(vbillstatus=1)的，并且是待委托办理(busistatus=1)
            if (this.state.activeTab.indexOf("sub") >= 0) {
                searchdata.custcondition = {
                    logic: "and",
                    conditions: [
                        {
                            field: "vbillstatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "1"
                                //secondvalue: null
                            }
                        },
                        {
                            field: "busistatus",
                            oprtype: "=",
                            value: {
                                firstvalue: "1"
                                //secondvalue: null
                            }
                        }
                    ]
                };
                let sub = {'sub':true};
                searchdata.userdefObj = sub;
               
               
            }
        }
        
    
        console.log("searchdata", searchdata);
        ajax({
            url: this.API_URL.queryList,
            data: searchdata,
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (
                        data &&
                        data.grid &&
                        data.grid[this.tableId].pageInfo.total > 0
                    ) {
                        toast({
                            color: "success",
                            content: this.state.json["fbmpublic-000016"]

                        }); /* 国际化处理： 查询成功*/
                        this.props.table.setAllTableData(
                            this.tableId,
                            data.grid[this.tableId]
                        );
                    } else {
                        // 提示语需要查询一下全部页签有没有
                        let has = false;
                        if (
                            data.groupData &&
                            JSON.stringify(data.groupData) != "{}"
                        ) {
                            Object.keys(data.groupData).forEach(function(key) {
                                if (data.groupData[key] !== "0") {
                                    has = true;
                                    return;
                                }
                            });
                        }
                        if (has) {
                            toast({
                                color: "success",
                                content: this.state.json["fbmpublic-000016"]
                            }); /* 国际化处理： 查询成功*/
                        } else {
                            toast({
                                color: "warning",
                                content: this.state.json["fbmpublic-000017"]
                            }); /* 国际化处理： 未查询出符合条件的数据！*/
                        }
                        this.props.table.setAllTableData(this.tableId, {
                            rows: []
                        });
                    }
                    this.queryListCallback && this.queryListCallback(res);
                    toggleListHeadBtnDisabled.call(this);
                }
            }
        });
    }
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
    ajax({
        url: this.API_URL.queryListPks,
        data: { pks, pageCode: this.pageId },
        success: res => {
            listRender.call(this, res);
        },
        error: res => {
            toast({ color: "danger", content: res.message });
            listRender.call(this, { success: false });
        }
    });
}

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/