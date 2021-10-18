/*Q2PoI0oSnwADA9edeKFLfqRPNyeSMHY/aj7zZcGjIJ0=*/

//请求基础路径
export const basePath = '/nccloud/bond/contract';
//接口地址
export default {
    save: `${basePath}/contractsave.do`,                   //保存
    delete: `${basePath}/contractdelete.do`,               //删除
    queryCard: `${basePath}/contractquerycard.do`,         //卡片查询
    queryList: `${basePath}/contractquerypage.do`,         //列表查询
    queryListPks: `${basePath}/contractquerybypks.do`,     //列表分页查询
    commit: `${basePath}/contractcommit.do`,               //提交
    saveCommit: `${basePath}/contractsavecommit.do`,       //保存提交
    uncommit: `${basePath}/contractuncommit.do`,           //收回
    print: `${basePath}/contractprint.do`,                 //打印
    terminate: `${basePath}/terminate.do`,                 //终止
    unterminate: `${basePath}/unterminate.do`,             //取消终止
    viewVersion: `${basePath}/versionlist.do`,             //查看版本
    deleteVersion: `${basePath}/delversion.do`,            //删除版本
    afterEvent: `${basePath}/cardeditafter.do`,            //编辑后事件接口
    queryVersion: `${basePath}/versioncard.do`,            //查询版本
}
/*Q2PoI0oSnwADA9edeKFLfqRPNyeSMHY/aj7zZcGjIJ0=*/