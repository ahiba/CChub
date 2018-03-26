
export default class Utils{
    static checkFavorite(item,items){//检查是否被用户收藏
        for(let i=0,len=items.length;i<len;i++){
            let id = item.id?item.id.toString():item.fullName
            if(id===items[i]){
                return true
            }

        }
        return false
    }
    static checkDate(longTime){//检查数据是否过时
        let cDate = new Date()
        let tDate = new Date()
        tDate.setTime(longTime)
        if(cDate.getMonth()!=tDate.getMonth())return false
        if(cDate.getDay()!=tDate.getDay())return false
        if(cDate.getHours()-tDate.getHours()>4)return false
        return true
    }
}
