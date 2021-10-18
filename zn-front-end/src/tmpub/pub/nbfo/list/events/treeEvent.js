/*+c4pk3XyB6gV0a56ysNzEikPZnyTK43XqD8faExqwrOsa5bSfpNfT8RVoQN+lQmX*/
import { ajax, toast, getLangCode } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant";
import { searchBtnClick } from "./search";
import { trimStr } from "../../../public/components/BaseEditList/event/utils";

/**
 * 非银行金融机构同步树相关事件
 * @author：dongyue7
 */

/**
 * 获取传输数据
 * @param {*} type           选择的类别
 * @param {*} userDefflag    是否不传userDefObj
 * @param {*} userDefflag    是否不传conditions
 */
export function getSendData(type, userDefflag = false, conditionFlag = false) {
    let pk_org = this.props.search.getSearchValByField(this.searchId, "pk_org");
    pk_org = pk_org.value.firstvalue;
    let metaData = this.props.meta.getMeta();
    let searchOid = metaData.search.oid;
    let data = {
        querycondition: {
            logic: "and",
            conditions: [
                {
                    field: "type",
                    value: {
                        firstvalue: type,
                        secondvalue: null
                    },
                    oprtype: "like",
                    display: null
                }
            ]
        },
        custcondition: {},
        pageInfo: {
            pageIndex: 0,
            pageSize: "10"
        },
        pageCode: this.pageId,
        pk_org: pk_org,
        queryAreaCode: "search",
        oid: searchOid,
        querytype: "tree",
        userdefObj: {
            pid: type
        }
    };
    if (userDefflag) {
        // 走列表查询接口时，不要传userdefObj
        delete data.userdefObj;
    }
    if (conditionFlag) {
        // 可以不传conditions
        data.querycondition.conditions.length = 0;
    }
    return data;
}

/**
 * 将ajax返回的数据处理为树所需的数据
 * @param {*} resData  后台返回的数据
 */
export function getTreeData(resData) {
    let realData = [];
    const langCode = getLangCode();
    const name =
        langCode === "simpchn"
            ? "name"
            : langCode === "english"
            ? "name3"
            : "name2";
    resData.map(e => {
        realData.push({
            key: e.pk_nonbanktype.value,
            pid: e.pid.value,
            refcode: e.code.value,
            refname:
                e.code.value +
                " " +
                ((e[name] && e[name].value) || e["name"].value),
            refpk: e.pk_nonbanktype.value,
            values: {},
            isleaf: e.leaf_mark.value,
            isLeaf: e.leaf_mark.value,
            iconBox: {
                addIcon: true,
                delIcon: true,
                editIcon: true
            }
        });
    });
    return realData;
}

/**
 * 获取点击icon传的数据
 * @param {*} info  模态框输入的信息
 * @param {*} key   节点pk
 * @param {*} id    节点信息
 */
export function getIconData(info, key, id) {
    let data = {
        model: {
            areaType: "form",
            rows: [
                {
                    values: {
						pk_org: info.pk_org,
                        code: info.code,
                        name: info.name && info.name,
                        name2: info.name2 && info.name2,
                        name3: info.name3 && info.name3,
                        name4: info.name4 && info.name4,
                        name5: info.name5 && info.name5,
                        name6: info.name6 && info.name6,
                        abbreviation: info.abbreviation,
                        pid: {
                            display: null,
                            value: id.pid
                        },
                        key: {
                            display: null,
                            value: key
                        },
                        pk_nonbanktype: {
                            display: null,
                            value: key
                        },
                        ts: {
                            value: id.nodeData && id.nodeData.ts
                        }
                    }
                }
            ]
        },
        pageid: this.pageId,
        templetid: this.templateId
    };
    return data;
}

// 创建根节点
export function deptRoot() {
    return {
        isleaf: false,
        pid: "",
        refname: this.state.json[
            "36010NBFO-000028"
        ] /* 国际化处理： 非银行金融机构*/,
        refpk: "-1"
    };
}

// 加载全部子节点并默认选中第一个
export function exdInit() {
    let sendData = getSendData.call(this, "-1", true, true);
    ajax({
        url: `${baseReqUrl}${javaUrl.listTreeSearch}.do`,
        data: sendData,
        async: false,
        success: res => {
            setTimeout(() => {
                this.props.syncTree.setSyncTreeData(this.treeId, [
                    Object.assign({
                        ...deptRoot.call(this)
                    })
                ]);
                let treeData = res.data && res.data;
                if (treeData.length !== 0) {
                    treeData.map(item => {
                        this.props.syncTree.addNodeSuccess(this.treeId, [item]);
                    });
                    this.props.syncTree.openNodeByPk(this.treeId, "-1");
                    this.props.syncTree.setNodeSelected(
                        this.treeId,
                        treeData[0].key
                    );
                    onSelectEve.call(this, treeData[0].key, treeData[0]);
                }
            }, 0);
        }
    });
}

// 初始化树表并加载根节点
export function onInit() {
    this.props.syncTree.setSyncTreeData(this.treeId, [
        Object.assign({
            ...deptRoot.call(this)
        })
    ]);
}

/**
 * 点击节点加载该节点下的表格数据并渲染在列表中
 * @param {*} info  节点pk
 * @param {*} key   节点信息
 * @param {*} id    是否被选中（true被选中，false没被选中）
 */
export function onSelectEve(info, key, id) {
    //传到state，赋值查询区使用
    this.setState({
        typeName: key.refname,
        typePk: key.refpk,
        showToast: false,
        typeQueryPk: key.refpk
    });
    this.props.search.setSearchValByField(this.searchId, "type", {
        value: key.refpk,
        display: key.refname.split(" ")[1]
    });
    // 根节点 及 第一级节点 不允许新增
    if (key.pid === "-1") {
        this.props.button.setButtonDisabled("Add", true);
    } else if (info === "-1") {
        this.props.button.setButtonDisabled("Add", true);
    } else {
        this.props.button.setButtonDisabled("Add", false);
        searchBtnClick.call(this, this.props);
    }
}

/**
 * 树增加回调
 * @param {*} info  模态框输入的信息
 * @param {*} key   节点pk
 * @param {*} id    节点信息
 */
export function addNodeCallBack(info, key, id) {
    // 去空格
    info.code.value = trimStr(info.code.value);
    info.name.value = trimStr(info.name.value);
    info.abbreviation.value = trimStr(info.abbreviation.value);
    if (!info.code.value || !info.name.value) {
        toast({
            color: "warning",
            content: this.state.json["36010NBFO-000038"]
        }); /* 国际化处理： 请输入机构类别编码和机构类别名称！*/
        return false; // 模态框不关闭（属性里必须有verifyModalForm: true）
    }
    let sendData = getIconData.call(this, info, key, id);
    // 新增节点需要删掉模板中的key、pk并加上pid
    delete sendData.model.rows[0].values.key;
    delete sendData.model.rows[0].values.pk_nonbanktype;
    sendData.model.rows[0].values.pid = {
        display: null,
        value: key
    };
    ajax({
        url: `${baseReqUrl}${javaUrl.listTreeSave}.do`,
        data: sendData,
        success: res => {
            toast({
                color: "success",
                content: this.state.json["36010NBFO-000039"]
            }); /* 国际化处理： 增加成功！*/
            // let newTreeData = res.data.type.rows[0].values;
            // let realNewTreeData = getTreeData.call(this, [ newTreeData ]);
            if (res !== null) {
                this.props.syncTree.addNodeSuccess(this.treeId, res.data[0]);
            }
        }
    });
    return true; // 控制模态框关闭
}

/**
 * 树删除回调
 * @param {*} info  模态框输入的信息
 * @param {*} key   节点pk
 * @param {*} id    节点信息
 */
export function delNodeCallBack(key) {
    let closeFlag = true;
    let delData = this.props.syncTree.getSyncTreeValue(this.treeId, key);
    // if (delData.children == undefined) {
    // 前台校验删除的节点是否有根节点
    ajax({
        url: `${baseReqUrl}${javaUrl.listTreeDelete}.do`,
        data: {
            pks: [key]
        },
        success: res => {
            toast({
                color: "success",
                content: this.state.json["36010NBFO-000027"]
            }); /* 国际化处理： 删除成功！*/
            this.props.syncTree.delNodeSuceess(this.treeId, key);
        },
        error: res => {
            closeFlag = false;
            toast({
                color: "warning",
                content: this.state.json["36010NBFO-000040"]
            }); /* 国际化处理： 该类别中有非银行金融机构数据，无法删除！*/
        }
    });
    return closeFlag;
    // } else {
    // 	toast({ color: 'warning', content: this.state.json['36010NBFO-000041'] }); /* 国际化处理： 无法删除非叶子节点！*/
    // }
}

/**
 * 树编辑回调
 * @param {*} info  模态框输入的信息
 * @param {*} key   节点pk
 * @param {*} id    节点信息
 */
export function editNodeCallBack(info, key, id) {
    if (info.code.value == null || info.name.value == null) {
        toast({
            color: "warning",
            content: this.state.json["36010NBFO-000038"]
        }); /* 国际化处理： 请输入机构类别编码和机构类别名称！*/
        return false; // 模态框不关闭（属性里必须有verifyModalForm: true）
    }
    if (
        info.code.value == id.refcode &&
        info.name.value == id.refname.split(" ")[1]
    ) {
        return true; // 模态框关闭
    }
    let sendData = getIconData.call(this, info, key, id);
    ajax({
        url: `${baseReqUrl}${javaUrl.listTreeSave}.do`,
        data: sendData,
        success: res => {
            toast({
                color: "success",
                content: this.state.json["36010NBFO-000042"]
            }); /* 国际化处理： 修改成功！*/
            // let newTreeData = res.data.type.rows[0].values;
            // let realNewTreeData = getTreeData.call(this, [ newTreeData ]);
            if (res !== null) {
                this.props.syncTree.editNodeSuccess(this.treeId, res.data[0]);
            }
        }
    });
    return true;
}

/**
 * 鼠标滑过根节点隐藏删除和编辑按钮
 * @param {*} key   节点pk
 */
export function onMouseEnterEve(key) {
    if (key == "-1") {
        this.props.syncTree.setIconVisible(this.treeId, [
            {
                key: "-1", //节点的refpk
                value: {
                    //默认都为true显示，隐藏设为false
                    addIcon: true,
                    delIcon: false,
                    editIcon: false
                }
            }
        ]);
    }
}

/**
 * 点击节点查询节点内一级的数据并加载到树中（作为异步树时使用，目前版本不支持，先留着）
 * @param {*} key   节点pk
 * @param {*} info  节点信息
 */
export function onTreeExpand(key, info) {
    // let nodeInfo = info.node.props;
    // if( info.expanded && nodeInfo.children.length == 0 ){ // 展开
    //     let sendData = getSendData.call(this, key[key.length-1]);
    //     ajax({
    //         url: `${baseReqUrl}${javaUrl.listTreeSearch}.do`,
    //         data: sendData,
    //         success: (res) => {
    //             let treeData = res.data.grid.type.rows;
    //             let treeDataValues = treeData.map((e)=>e.values);
    //             let realTreeData = getTreeData.call(this, treeDataValues);
    //             this.props.syncTree.addNodeSuccess(this.treeId, realTreeData);
    //         }
    //     });
    // } else {
    //     nodeInfo.children.map( e => {
    //         this.props.syncTree.delNodeSuceess(this.treeId, e.key); // 删除闭合节点的所有子节点
    //     } );
    //     this.props.syncTree.editNodeSuccess(this.treeId, {
    //         refpk: nodeInfo.refpk,
    //         isleaf: nodeInfo.isleaf,
    //         isLeaf: nodeInfo.isLeaf,
    //     });
    // }
}

/**
 * 点击编辑icon将值带到表单中
 */
export function clickEditIconEve(info) {
    let editRefName = info.refname ? info.refname.split(" ")[1] : "";
    let editRefCode = info.code ? info.code.split(" ")[0] : "";
    let editRefAbbreviation = info.nodeData.abbreviation ? info.nodeData.abbreviation : "";
    let editRefPkOrg = info.nodeData.pk_org ? info.nodeData.pk_org : "";
    let editRefOrgname = info.nodeData.orgname ? info.nodeData.orgname : "";
    this.props.form.setFormItemsValue("treeForm", {
        code: {
            value: editRefCode,
            display: editRefCode
        },
        name: {
            value: editRefName,
            display: editRefName
        },
        abbreviation: {
            value: editRefAbbreviation,
            display: editRefAbbreviation
        },
        pk_org: {
            value: editRefPkOrg,
            display: editRefOrgname
        }
    });
}

/**
 * 点击编辑icon将值带到表单中
 */
export function clickAddIconEve(info) {
    let props = this.props;
    if (this.appcode == "36010NBFO") {
        //给全局的所属组织赋默认值
        props.form.setFormItemsValue("treeForm", {
            pk_org: {
                value: "GLOBLE00000000000000",
                display: this.state.json['36010NBFO-000046']
            }
        });
    } else if (this.appcode == "36010NBFOG") {
        //给集团和组织赋当前登陆的集团
        let { groupId, groupName } = this.businessInfo;
        if (groupId && groupName) {
            props.form.setFormItemsValue("treeForm", {
                pk_org: {
                    value: groupId,
                    display: groupName
                }
            });
        }
    } else {
        //给组织赋当前组织
        let { pk_org, org_Name, pk_org_v, org_v_Name } = this.state.context;
        if (pk_org && pk_org != "GLOBLE00000000000000") {
            props.form.setFormItemsValue("treeForm", {
                pk_org: {
                    value: pk_org,
                    display: org_Name
                },
                pk_org_v: {
                    value: pk_org_v,
                    display: org_v_Name
                }
            });
        }
    }
}

/**
 * 清空搜索框回调
 */
export function clearSearchVal() {
    this.props.syncTree.openNodeByPk(this.treeId, "-1");
}

/*+c4pk3XyB6gV0a56ysNzEikPZnyTK43XqD8faExqwrOsa5bSfpNfT8RVoQN+lQmX*/