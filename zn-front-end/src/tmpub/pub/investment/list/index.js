/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 投融资品种
 * @author：zhangyangz
 * @update：dongyue7
 */

import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import BaseEditList from "../../public/components/BaseEditList";
import initTemplate from "../../public/components/BaseEditList/event/editListInitTemplate";
import {
    app_code,
    btnCode,
    checkRef,
    del,
    disabled_btn,
    disEnable,
    enable,
    enableflag,
    list_page_id,
    list_search_id,
    list_table_id,
    moduleId,
    name,
    primaryId,
    query,
    save,
    search_oid,
    sysmark,
    table_oid
} from "../cons/constant.js";
import { afterEvent, beforeSetMeta } from "./events/index";

class List extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({ json, inlt });
            } else {
                //console.log("未加载到多语资源");
            }
        };
        this.props.MultiInit.getMultiLang({
            moduleId: [moduleId, "36010PUBLIC"],
            domainName: "tmpub",
            callback
        });
    }

    render() {
        return (
            <BaseEditList
                constant={{
                    appId: app_code, //小应用id
                    searchId: list_search_id, //查询区code
                    tableId: list_table_id, //表格code
                    pageId: list_page_id, //页面code
                    primaryId: primaryId, //主键id
                    queryInterface: query, //查询接口
                    searchOid: search_oid, //查询区oid
                    disableBtn: disabled_btn, //禁用按钮
                    tableOid: table_oid, //列表oid
                    name: name, //单据名称
                    sysMark: sysmark, //系统预置标识
                    enableFlag: enableflag, //启用停用标识
                    delUrl: del, //删除接口
                    checkUrl: checkRef, //检查是否引用接口
                    saveUrl: save, //保存接口
                    enableUrl: enable, //启用接口
                    disEnableUrl: disEnable, //停用接口
                    btnCode: btnCode, //肩部按钮区域
                    pageTitle: "36010IFV-000000", //页面title
                    showIndex: true, //是否显示序号
                    moduleId: moduleId //多语ID
                }}
                _initTemplate={initTemplate}
                _beforeSetMeta={beforeSetMeta}
                _afterEvent={afterEvent}
                {...this.props}
            />
        );
    }
}

List = createPage({})(List);

ReactDOM.render(<List />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/