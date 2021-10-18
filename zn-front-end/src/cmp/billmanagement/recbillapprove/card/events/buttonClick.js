/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
  annexBtn, printBtn, outputBtn, linkquerybillBtn,
  querymsgBtn, queryvoucherBtn, queryconsumeBtn,
  querysynbillBtn, imageviewBtn, imagescanBtn
} from './method.js';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
export default function (props, id) {
  switch (id) {

    //刷新按钮
    case 'refreshBtn':
      this.refresh();
      break;
    //附件
    case 'annexBtn':
      annexBtn.call(this);
      break;
    //打印
    case 'printBtn':
      printBtn.call(this);
      break;
    //输出
    case 'outputBtn':
      outputBtn.call(this);
      break
    //联查单据  
    case 'linkquerybillBtn':
      linkquerybillBtn.call(this);
      break
    //查看审批意见 
    case 'querymsgBtn':
      querymsgBtn.call(this);
      break
    //联查凭证   
    case 'queryvoucherBtn':
      queryvoucherBtn.call(this);
      break;
    //联查计划预算
    case 'queryconsumeBtn':
      queryconsumeBtn.call(this);
      break;
    //联查协同单据
    case 'querysynbillBtn':
      querysynbillBtn.call(this);
      break
    //影像查看
    case 'imageviewBtn':

     if(CMPEableSscivm.call(this)){
              return ;
 }
      imageviewBtn.call(this);
      break;
    //影像扫描
    case 'imagescanBtn':

if(CMPEableSscivm.call(this)){
              return ;
 }    
      imagescanBtn.call(this);
      break;
    default:
      break
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/