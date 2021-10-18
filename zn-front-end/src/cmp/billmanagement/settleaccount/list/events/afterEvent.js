/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
export default function (key, val, moduleId, datatype) {
    
    switch (key) {
        //财务组织
        case 'pk_org':
            if (val && val.refpk) {
                this.refresh();
            }else{
                this.props.table.setAllTableData(this.tableId, { rows: [] ,pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0}});
            }
            break;
        //会计日期
        case 'settle_date':
            let data = val == null ? null : val.substr(0, 4);
            this.props.search.setSearchValByField(this.searchId, key, { value: val, display: data });
            this.refresh();
            break;
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/