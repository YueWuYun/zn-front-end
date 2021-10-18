/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 工具类函数
    Created by: liyaoh 2018-09-17
 */
/*
 * @method 浮点数减法运算
 * @param 
 *     num1 num2  scale //精度 默认3       {num}     数字   signal 加法或减法运算 默认为加法 减法传false 
 * @return   number 差值或者和
 * @demo     AccSum(20.1,20,3)
 */

 export const AccSum = (num1, num2, signal= true) =>{
    let r1,r2,m,n;
    try{r1=num1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=num2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    let type= signal ? 1 : -1;
    return ((num1*m + type*num2*m)/m);
 }


/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/