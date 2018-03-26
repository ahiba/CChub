import {
    AsyncStorage
} from 'react-native'
import DataReposity,{FLAG_STORAGE} from './DataReposity'
import Utils from '../../util/Utils'

export default  class ReposityUtils{
    constructor(aboutCommon){
        this.aboutCommon = aboutCommon
        this.dataReposity = new DataReposity(FLAG_STORAGE.flag_my)
        this.itemMap = new Map()
    }
    updateData(k,v){
        this.itemMap.set(k,v)
        let arr = []
        for(let value of this.itemMap.values()){
            arr.push(value)
        }
        this.aboutCommon.onNotifyDataChanged(arr)
    }
    fetchReposity(url){//根据指定的url获取数据
        this.dataReposity.fetchReposity(url)
            .then(result=>{
                if(result){
                    this.updateData(url,result)
                    if(!Utils.checkDate(result.update_date)){
                         return this.dataReposity.fetchNetReposity(url)
                    }
                }
            })
            .then(item=>{
                if(item){
                    this.updateData(url,item)
                }
            })
            .catch(error=>{

            })

    }
    fetchReposities(urls){//根据一组url获取数据
        for(let i=0,len=urls.length;i<len;i++){
            let url = urls[i]
            this.fetchReposity(url)
        }
    }
}