/*q+Tp88nQNo7z782f3GAtCFKK0PzcIzOrnTcHXcNKtcyyje4ALrUe3sIGwvrMIl8T*/
export const list = (search, code,code2,code3) => {
    return [
        {
            itemtype: 'refer',
            label: code,
            code: 'm_pk_corp',
            required: true,
            config: {
                placeholder: code, 
                refName: code, 
                name: 'm_pk_corp',
                queryTreeUrl: '/nccloud/uapbd/org/FinanceOrgAllGroupAllDataRefTree.do',
                refType: 'tree',
                refCode: 'uapbd.refer.org.FinanceOrgAllGroupAllDataTreeRef',
                isMultiSelectedEnabled: false,
                isTreelazyLoad: false,
                isShowDisabledData: true, // 显示停用
                isHasDisabledData: true, 
                treeConfig: {name:[ code2,code3],code: [ 'refcode','refname']},
                rootNode: { refname: code, refpk: 'root' },
                queryCondition: {
                    isDataPowerEnable: 'Y',
                    TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgAllGroupBuilder'
                },
                value: {
                    refname: search.m_pk_corpName, 
                    refpk: search.m_pk_corp
                }
            }
        }
    ];
}
/*q+Tp88nQNo7z782f3GAtCFKK0PzcIzOrnTcHXcNKtcyyje4ALrUe3sIGwvrMIl8T*/