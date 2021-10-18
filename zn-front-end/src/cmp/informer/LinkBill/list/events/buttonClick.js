/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print } from 'nc-lightapp-front';
import { printClick } from './printClick';
import { queryBills } from './queryBills';
let tableId = 'table';
let { NCMessage } = base;
export default function buttonClick(props, id) {
   
    switch (id) {
        //联查
        case 'query':
            queryBills(props);
            break;
        //打印
        case 'printbtns':
            printClick(this, props, id);
            break;
        //输出
        case 'printout':
            printClick(this, props, id);
            break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/