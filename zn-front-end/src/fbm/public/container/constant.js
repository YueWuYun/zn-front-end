/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/
/* 
    其他节点常量，主要用于联查
*/

//联查凭证跳转路径
export const VoucherDataConst = {
    pagecode: '10170410_1017041001',
    appcode: '10170410'
};

//发债申请
export const bondApplyConst = {
    url: '/bond/bond/apply/main/index.html#/card',
    appcode: '36650BA',
    pagecodeList: '36650BA_LIST',
    pagecodeCard: '36650BAL_CARD'//'36650BA_CARD'
}

//债券契约
export const bondContractConst = {
    url: '/bond/bond/contract/main/index.html#/card',
    appcode: '36650BC',
    pagecodeList: '36650BC_LIST',
    pagecodeCard: '36650BC_CARD'
}

//债券发行
export const bondRegisterConst = {
    url: '/bond/bond/register/main/index.html#/card',
    appcode: '36650BIS',
    pagecodeList: '36650BIS_LIST',
    pagecodeCard: '36650BIS_CARD'
}

//结息日
export const settledateConst = {
    url: '/tmpub/pub/settledate/main/index.html#/card',
    appcode: '36010ISDC',
    pagecodeList: '36010ISDC_LIST_01',
    pagecodeCard: '36010ISDC_CARD_01'
}

//根据利率类型联查利率
export const linkInterestConst = {
    //todo 改成联查模板code
    //组织
    '0': {
        url: '/tmpub/pub/interestrate_org/main/index.html#/card',
        appcode: '36010IRCO',
        pagecode: '36010IRCO_card',
    },
    //集团
    '1': {
        url: '/tmpub/pub/interestrate_group/main/index.html#/card',
        appcode: '36010IRCG',
        pagecode: '36010IRCG_card',
    },
    //全局
    '2': {
        url: '/tmpub/pub/interestrate_global/main/index.html#/card',
        appcode: '36010IRC',
        pagecode: '36010IRC_card',
    }
}

//利息清单
export const interestListConst = {
    urlList: '/bond/bond/interestlist/main/index.html#/list',
    urlCard: '/bond/bond/interestlist/main/index.html#/card',
    appcode: '36650BCIB',
    pagecodeList: '36650BCIB_LIST',
    pagecodeCard: '36650BCIB_CARD'
}

//额度上收
export const upquotaConst = {
    urlList: '/fbm/pfbm/upquota/main/index.html#/list',
    urlCard: '/fbm/pfbm/upquota/main/index.html#/card',
    appcode: '36185530',
    pagecodeList: '36185530_LIST',
    pagecodeCard: '36185530_CARD'
}

//单位下拨可用额度
export const unitquotaConst = {
    urlList: '/fbm/pfbm/quotasummary/main/index.html#/list',
    appcode: '36185540',
    pagecodeList: '36185540_LIST',
}

//申请单
export const quotaapplyConst = {
    urlCard: '/fbm/pfbm/quotaapply/main/index.html#/list',
    appcode: '36180QA',
    pagecodeCard: '36180QAL_List',
}

//应付票据贴现
export const buyerdiscount = {
    urlList: '/fbm/fbm/buyerdiscount/main/index.html#/list',
    urlCard: '/fbm/fbm/buyerdiscount/main/index.html#/card',
    appcode: '36180PDT',
    pagecodeList: '36180PDT_LIST',
    pagecodeCard: '36180PDT_CARD'
}

/*HsJGgXoCueKidK+JSYUoEmNcGPqdTjz1l6/cf28pPu0kUlBaidALKwDeE66avFOR*/