//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9
import {cardCache,toast} from "nc-lightapp-front";
import Utils from '../../../../../public/utils/index';
const {queryToastFunc} = Utils;
let {setDefData} = cardCache;

//查询区按钮点击事件
export default  function onClickSearchBtn(props,data){
    const _this = this;
    let searchData = _this.props.search.getAllSearchData(_this.config.searchId);
    if(typeof (searchData) !=='undefined'&&searchData&&searchData.conditions){
        setDefData('searchVal',_this.config.datasource,searchData);
        _this.loadGridData(_this.getLoadParmData(_this.props),(param)=>{
            queryToastFunc.call(this)(param);
            this.setInitializeBtns();
        });
    }else{
        return;
    }

}
//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9