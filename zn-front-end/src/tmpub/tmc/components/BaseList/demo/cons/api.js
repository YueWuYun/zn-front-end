/*Q2PoI0oSnwADA9edeKFLfqRPNyeSMHY/aj7zZcGjIJ0=*/
//接口地址

const basePath = '/nccloud/bond/calcintst';
export default {
    //必传接口。BaseList需要用到的接口
    queryList: `${basePath}/querylist.do`,         //必传。列表查询
    queryListPks: `${basePath}/querypage.do`,      //必传。列表分页查询
    print: `${basePath}/print.do`,                 //有打印必传。打印
    //业务接口。根据业务需要添加相应接口名称
    commit: `${basePath}/commit.do`,               //提交
    uncommit: `${basePath}/uncommit.do`,           //收回
    delete: `${basePath}/delete.do`,               //删除
}
/*Q2PoI0oSnwADA9edeKFLfqRPNyeSMHY/aj7zZcGjIJ0=*/