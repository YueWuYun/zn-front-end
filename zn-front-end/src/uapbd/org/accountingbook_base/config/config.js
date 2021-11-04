//J08Tqn6YHvGZZ/eEvGdiViA5ZfdTeVV8ib5x+mmEdPur8CNA+XsB2MB3PVOqXXOg
export const config={
     gridId : 'accountingbooklist',
     searchId : 'accountingbook_search',
     pagecode : '10100ACB_accountingbook',
     batchAddFormPageCode : '10100ACB_accountingbookbatchadd',
     batchAddListPageCode : '10100ACB_accountingbook_cardTable',
     formId : 'accountingbookcard',
     batchaddform : 'accountingbookbatchcard',
     batchaddtable : 'accountingbookbatchlist',
     funcode : '10100ACB',
     listPrint : 'accountingBookListPrint',
     cardPrint : 'accountingBookEditorPrint',
     formEnable : ['accountenablestate','assetenablestate','materialenablestate','taxenablestate','productcostenablestate','itemcostenablestate','enablestate'],
     formPeriod : {'account':'pk_accountperiod','asset':'pk_assetperiod','itemcost':'pk_itemcostperiod','material':'pk_materialperiod','productcost':'pk_productcostperiod'},//'tax':'pk_taxperiod'
     ajaxurl : {
        mergerequest : "/nccloud/platform/pub/mergerequest.do",
        queryTemplateUrl: "/platform/templet/querypage.do",
        queryPage: '/nccloud/uapbd/accountingbook/query.do',
        queryPageIndex:'/nccloud/uapbd/accountingbook/querypage.do',
        add: '/nccloud/uapbd/accountingbook/add.do',
        edit: '/nccloud/uapbd/accountingbook/edit.do',
        saveAdd: '/nccloud/uapbd/accountingbook/save.do',
        queryBypk: '/nccloud/uapbd/accountingbook/queryBypk.do',
        delete: '/nccloud/uapbd/accountingbook/delete.do',
        enable: '/nccloud/uapbd/accountingbook/enable.do',
        LoadOrgTree: '/nccloud/uapbd/accountingbook/queryFinance.do',
        queryChangeBook: '/nccloud/uapbd/accountingbook/queryChangeBook.do',
        changeBook: '/nccloud/uapbd/accountingbook/changeBook.do',
        print: '/nccloud/uapbd/accountingbook/print.do',
        batchsave:'/nccloud/uapbd/accountingbook/batchsave.do',
        queryAccperiodschemeAndCurrtype: '/nccloud/uapbd/accountingbook/queryAccperiodschemeAndCurrtype.do',
        queryCurraccchart: '/nccloud/uapbd/accountingbook/queryCurraccchart.do',
        queryFactorchart: '/nccloud/uapbd/accountingbook/queryFactorchart.do',
        deletepre: '/nccloud/uapbd/accountingbook/deletepre.do',
        enablepre: '/nccloud/uapbd/accountingbook/enablepre.do',
        editparaccount:'/nccloud/uapbd/accountingbook/editparaccount.do'
    }
}
//J08Tqn6YHvGZZ/eEvGdiViA5ZfdTeVV8ib5x+mmEdPur8CNA+XsB2MB3PVOqXXOg