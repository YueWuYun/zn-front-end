//zdFMCA6UFzw81iu0KfYh45foVH/i8RKVgUSS8zrDn6B3YaokDRxPQpWwfQK16uSL

let constant = {
    pageCode: '',
    searchId: 'searchArea',
    pageId: '',
    pageName: '',
    formId: 'formArea',
    treeId: "contractTree",
    nodeType: '',
    refTreeRootName: '',
    modalId: "modalId",
    appCode: '',
    btnArea: 'page_header',
    transferModalId: 'transferModalId',
    dataSource: 'co.cobase.cbs.tree',
    refOrgTreeRootName: "组织",
    orgTreeId: 'treeId',
    modalCBSId: 'modalCBSId'

}
const attrcodeObj = {
    pkOrg: 'pk_org',
    orgName: 'org_Name',
    pkPrimery: 'pk_cbsnode',
    pkProjecttype: "pk_projecttype",
    isLeafNode: 'isleafnode',//是否是末级结点,
    isDefalut: 'isdefault', //是否是默认成本单元
    pkFinanceOrg: 'pk_financeorg',
    pkCorp: 'pk_corp',
    pkGroup: 'pk_group',
    pkProject: 'pk_project',
    nodetype: 'node_type',
    pkFather: 'pk_father',
    code: 'code',
    name: 'name',
    pkFinancePrimery: "pk_financeorg",
    pkVid: 'pk_vid',
    isleaf : 'isleaf',
    assetclassDef :'assetclass_def'

}
const ajaxUrl = {
    queryTreeUrl: "/nccloud/co/cbs/queryTree.do",
    queryCardUrl: "/nccloud/co/cbs/queryCard.do",
    editUrl: "/nccloud/co/cbs/CBSUpdate.do",
    insertUrl: "/nccloud/co/cbs/insert.do",
    deleteUrl: "/nccloud/co/cbs/delete.do",
    importUrl: "/nccloud/co/cbs/CBSImport.do",
    doCBSAssignUrl: "/nccloud/co/cbs/CBSAssign.do",
    setDefaultUnit: "/nccloud/co/cbs/CBSSetDefault.do",
    queryFinanceOrg: "/nccloud/co/cbs/FinanceOrgQuery4Group.do",
    cancelCBSAssignUrl : "/nccloud/co/cbs/CBSCancelAssign.do",
    doCBSValidatorUrl : "/nccloud/co/cbs/CBSValidator.do",
    doCBSProValidatorUrl : "/nccloud/co/cbs/CBSProValidator.do",
    printUrl: '/nccloud/pmbd/pmpub/print.do',
};

const modalConfig = {
    cancelConfig: {
        title: "取消编辑？",
        content: "是否取消编辑数据?",
        rightBtnName: "取消",
        leftBtnName: "确定"
    },
    deleteConfig: {
        title: "删除",
        content: "您确定要删除所选数据及其子孙节点吗？",
        rightBtnName: "取消",
        leftBtnName: "删除"
    },
    deleteNoChilConfig: {
        title: "删除",
        content: "您确定要删除所选数据吗？",
        rightBtnName: "取消",
        leftBtnName: "删除"
    },
}
const toastConfig = {
    delSucess: { title: "", content: "删除成功！" },
    addSucess: { title: "", content: "新增成功！" },
    editSucess: { title: "", content: "修改成功！" },
    querySucess: { title: "", content: "查询成功！" },
    refreshSuccess: { title: "", content: "刷新成功！" },
    assignSuccess: { title: "", content: "分配成功！" },
    cancelAssignSuccess: { title: "", content: "取消分配成功！" },
    addCBSWarning: { title: "", content: "当前节点是默认cbs且是末级，不允许新增下级节点", color: 'warning' },
    editCBSWarning: { title: "", content: "当前节点是默认cbs，不允许修改下级节点", color: 'warning' },
    deleteCBSWarning: { title: "", content: "当前节点是默认cbs，不允许删除下级节点", color: 'warning' },
    importSuccess: { title: "", content: "引入成功！"},
    warning:{title: "", content: "您有必输项未填写，请填写", color: 'warning'},
    financeOrgWaring:{title: "", content: "指定的财务组织为空", color: 'warning'},
    cbsWaring:{title: "", content: "待分配的CBS为空", color: 'warning'}
}

const TreeIconAddShow = {
    addIcon : true,
    delIcon : false,
    editIcon : false
};

export {
    constant,
    modalConfig,
    toastConfig,
    attrcodeObj,
    ajaxUrl,
    TreeIconAddShow
}

//zdFMCA6UFzw81iu0KfYh45foVH/i8RKVgUSS8zrDn6B3YaokDRxPQpWwfQK16uSL