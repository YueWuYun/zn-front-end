//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import AccountBaseRefer from '../AccountDefaultGridTreeRef/AccountBaseRefer';

/**
 * 全局或集团级会计科目参照 入口
 * @param props
 * @returns {*}
 */

export default function (props = {}) {
    let conf = {
        multiLang: {
            domainName: 'uapbd',
            currentLocale: 'zh-CN',
            moduleId: 'refer_uapbd',
        },

        refType: 'gridTree',
        refName: 'refer-000066',/* 国际化处理： 会计科目*/
        placeholder: 'refer-000071',/* 国际化处理： 全局或集团下科目*/
        rootNode: { refname: 'refer-000066', refpk: 'root' },/* 国际化处理： 会计科目*/
        refCode: 'uapbd.fiacc.AccountGridTreeRefInGroupOrGlobal',
        queryTreeUrl: '/nccloud/uapbd/ref/AccountModelRefer.do',
        queryGridUrl: '/nccloud/uapbd/ref/AccountModelRefer.do',
        isMultiSelectedEnabled: false,
        isShowHighFilter: true,//是否显示高级搜索框
        isShowDisabledData: false,//是否显示 显示停用
        isAccountRefer: false,//区分组织级和全局或集团级标志
        columnConfig: [{ name: ['refer-000067', 'refer-000068'], code: ['refcode', 'refname'] }],/* 国际化处理： 科目编码,科目名称*/
        //treeConfig:{name:['编码', '名称'],code: ['refcode', 'refname']},
        isHasDisabledData: false
    };

    return <AccountBaseRefer {...conf} {...props} />
}

/*************************************************************************
 * 2018-07-24 记录备份一下：
 * import AccountRefer from '../AccountDefaultGridTreeRef/AccountRefer';
 *
 * 等财务把参照验过了，把
 * 	（import AccountRefer from '../AccountDefaultReferModelRef/AccountRefer';）
 * 	路径替换成
 *  （import AccountRefer from '../AccountDefaultGridTreeRef/AccountRefer';）
 *************************************************************************/

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65