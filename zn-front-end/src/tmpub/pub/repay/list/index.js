/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**
 * 还款方式
 * @author dongyue7
 */

import React from "react";
import ReactDOM from "react-dom";
import { createPage } from "nc-lightapp-front";
import BaseEditList from "../../public/components/BaseEditList/index";
import {
  list,
  del,
  appCode,
  listQuery,
  name,
  oprName,
  sysMark,
  enableFlag,
  checkRef,
  save,
  start,
  stop,
  page_title,
  moduleId
} from "../cons/constant.js";
import {
  beforeEvent,
  afterEvent,
  afterSearch,
  beforeSave,
  afterSetTable,
  beforeBatch,
  beforeOpr
} from "./events/index";

let List = props => {
  return (
    <BaseEditList
      constant={{
        appId: appCode, //小应用id
        searchId: list.searchCode, //查询区code
        tableId: list.tableCode, //表格code
        pageId: list.pageCode, //页面code
        primaryId: list.primaryId, //主键id
        queryInterface: listQuery, //查询接口
        searchOid: list.searchOid, //查询区oid
        disableBtn: list.disabled_btn, //禁用按钮
        tableOid: list.listOid, //列表oid
        name: name, //单据名称
        oprName: oprName, //操作名称
        sysMark: sysMark, //系统预置标识
        enableFlag: enableFlag, //启用停用标识
        delUrl: del, //删除接口
        checkUrl: checkRef, //检查是否引用接口
        saveUrl: save, //保存接口
        enableUrl: start, //启用接口
        disEnableUrl: stop, //停用接口
        btnCode: list.btnCode, //肩部按钮区域
        pageTitle: page_title, //页面title
        showIndex: false, //是否显示序号
        moduleId: moduleId //多语ID
      }}
      _beforeEvent={beforeEvent}
      _afterEvent={afterEvent} // 编辑后事件
      _afterSetTable={afterSetTable} // 渲染表格后事件
      _beforeBatch={beforeBatch} // 操作列按钮批操作
      _beforeOpr={beforeOpr} //操作列按钮操作前处理
      _beforeSave={beforeSave} //保存前
      _afterSearch={afterSearch} //查询后渲染列表前的操作
      {...props}
    />
  );
};
// class List extends Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {

//     }
// }
List = createPage({})(List);

ReactDOM.render(<List />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/