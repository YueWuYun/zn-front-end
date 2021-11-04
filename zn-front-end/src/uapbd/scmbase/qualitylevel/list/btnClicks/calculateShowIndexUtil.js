//6PSN16cnjAiA5Nd88sMD42vtNfy95kcUNWQAsI4e331lythi+snQ982wGmiCi/TNs3lzYG79y51R
//e9eFq2nHgA==
/*
 * @Author: 刘奇 
 * @PageInfo: 根据操作行返回默认显示的行号  
 * @Date: 2018-09-07 11:24:30 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-09-07 11:27:27
 */
export default function calculateShowIndex(allLength, checkLength, endIndex) {
	if (endIndex < allLength - 1) {
		return endIndex + 1 - checkLength;
	} else {
		return allLength - 1 - checkLength;
	}
}

//6PSN16cnjAiA5Nd88sMD42vtNfy95kcUNWQAsI4e331lythi+snQ982wGmiCi/TNs3lzYG79y51R
//e9eFq2nHgA==