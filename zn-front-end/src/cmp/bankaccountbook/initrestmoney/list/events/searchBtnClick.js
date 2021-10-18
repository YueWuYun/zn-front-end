/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import {ajax,toast} from 'nc-lightapp-front';
import {setButtonVisible} from './initRestMoneyDate';
//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {
    let json1 = this.state.json;
    let treeid = 'tree';
    //let treeInfo = props.syncTree.getSyncTreeValue(treeid);
    let selectTree = props.syncTree.getSelectNode(treeid);
    let fundform = null;
    if(selectTree && selectTree.refcode && selectTree.refcode!="-1"){
        fundform = selectTree.refcode;
    }else{
        toast({ color: 'warning', content: json1['360701OB-000001'] });/* 国际化处理： 请选择资金形态*/
    }
    if(searchVal && fundform){
        //let pageInfo = props.table.getTablePageInfo(this.tableId);
        if (!searchVal.conditions[0]) {
            toast({
                color:'warning',content: json1['360701OB-000030']/* 国际化处理： 请选择组织*/
            });
            return;
        }
        searchVal.conditions[0].value.secondvalue = fundform;
        // 建账日期删除掉，不传后台
        if (searchVal.conditions[1]) {
            delete searchVal.conditions[1];
        }
        let data={
            conditions: searchVal.conditions || searchVal,
            //pageInfo:pageInfo,
            pagecode: '360701OB_L01',
            queryAreaCode:'search_area',  //查询区编码
            oid:'1001A81000000001RROD',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'simple'
        };  
        ajax({
            url: '/nccloud/cmp/bankaccountbook/initrestmoneyquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data){
                        //begin tm tangleic 20200326 查询后的数据注入到表格都需要存入缓存，修改之后便于从缓存中恢复数据
                        // this.props.editTable.setTableData(this.tableId, data[this.tableId], false);
                        this.props.editTable.setTableData(this.tableId, data[this.tableId], true);
                        setButtonVisible(props,true);
                        //end tm tangleic
                    }else{
                        //begin tm tangleic 20200326 查询后的数据注入到表格都需要存入缓存，修改之后便于从缓存中恢复数据
                        // this.props.editTable.setTableData(this.tableId, {rows:[]}, false);
                        this.props.editTable.setTableData(this.tableId, {rows:[]}, true);
                        //end tm tangleic
                    }
                    
                }
            }
        });
    }
    
};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/