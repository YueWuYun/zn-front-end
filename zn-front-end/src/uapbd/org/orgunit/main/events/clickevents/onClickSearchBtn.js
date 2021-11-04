//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9
import {cardCache} from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
//查询区按钮点击事件
export default  function onClickSearchBtn(props,data){
    let conditions = [];
    let custcondition = {};
    //如果查询区必输项没有输入
    if(data===false || data == null){
        conditions.push({display:'启用状态',field:'enablestate',oprtype:'=',value:{firstvalue:'2',secondvalue:null}});
        data = {conditions,logic:'and'};
    }
    let checkflag = getDefData('orgunit_checkflag', 'uapbd.org.orgunit.orgunit');//cacheTools.get('orgunit_checkflag');
    //如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用
    if(checkflag == undefined || checkflag){
        conditions.push({display:'启用状态',field:'enablestate',oprtype:'=',value:{firstvalue:'2',secondvalue:null}});
        custcondition = {conditions,logic:'and'};
    }

    
    //let pageInfo =props.table.getTablePageInfo(props.config.gridId);
    let pageInfo = {}
    let paramData = {
        querycondition:data,
        // custcondition:{
        //     conditions:[{
        //         field:'pk_group',
        //         value:{
        //             firstvalue:null
        //         },
        //         oprtype:'='
        //     }]
        // },
        custcondition:custcondition,
        pagecode:this.config.pagecode,
        queryAreaCode:this.config.searchId,
        pageInfo:{},
        querytype:'tree',
        oid:getDefData('orgunit_searchoid', 'uapbd.org.orgunit.orgunit'),//cacheTools.get('orgunit_searchoid')
    };
    //校验通过后，条件查询请求
    this.loadGridData(paramData);
    props.button.setButtonDisabled(['refresh'],false); 
    setDefData('orgunit_btnopr',props.config.datasource,'query');
    //缓存查询区数据
    let searchData = props.search.getAllSearchData(this.config.searchId);

    setDefData('orgunit_searchVal','uapbd.org.orgunit.orgunit',searchData);
    //cacheTools.set('orgunit_searchVal',searchData);
}
//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9