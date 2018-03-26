import {
    AsyncStorage
} from 'react-native'
import GitHubTrending from 'GitHubTrending'
export const FLAG_STORAGE = {flag_popular:'popular',flag_trending:'trending',flag_my:'my'}
export default class dataReposity{
    constructor(flag){
        this.flag = flag
        if(flag===FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending()
    }
    fetchReposity(url){
        return new Promise((resolve,reject)=>{
            this.fetchLocalReposity(url)
                .then(result=>{
                    if(result){
                        resolve(result)
                    }else{
                        this.fetchNetReposity(url)
                            .then(result=>{
                                resolve(result)
                            })
                            .catch(error=>{
                                reject(error)
                            })
                    }
                })
                .catch(error=>{
                    this.fetchNetReposity(url)
                        .then(result=>{
                            resolve(result)
                        })
                        .catch(error=>{
                            reject(error)
                        })
                })
        })
    }

    fetchLocalReposity(url){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(url,(error,result)=>{
                if(!error){
                    try{
                        resolve(JSON.parse(result))
                    }catch (e){
                        reject(e)
                    }
                }else{
                    reject(error)
                }
            })
        })
    }
    fetchNetReposity(url){
        return new Promise((resolve,reject)=>{
            if(this.flag===FLAG_STORAGE.flag_trending){
                this.trending.fetchTrending(url)
                    .then(result=>{
                        if(!result){
                            reject(new Error('responseData is null'))
                            return
                        }
                        this.saveReposity(url,result)
                        resolve(result)
                    })
            }else{
                fetch(url)
                    .then(response=>response.json())
                    .then(result=>{
                        if(this.flag===FLAG_STORAGE.flag_my&&result){
                            this.saveReposity(url,result)
                            result(result)
                        }else if(result&&result.items){
                            resolve(result.items)
                            this.saveReposity(url,result.items)
                        }else{
                            reject(new Error('responseData is null'))
                        }
                        // if(!result){
                        //     reject(new Error('responseData is null'))
                        //     return
                        // }
                        // resolve(result.items)
                        // this.saveReposity(url,result.items)
                    })
                    .catch(error=>{
                        reject(error)
                    })
            }

        })
    }
    saveReposity(url,items,callBack){
        if(!url||!items)return
        let wrapData
        if(this.flag===FLAG_STORAGE.flag_my){
            wrapData = {item:items,update_date:new Date().getTime()}
        }else{
            wrapData = {items:items,update_date:new Date().getTime()}
        }
        // let wrapData = {items:items,update_date:new Date().getTime()}
        AsyncStorage.setItem(url,JSON.stringify(wrapData),callBack)
    }
    checkDate(longTime){
        let cDate = new Date()
        let tDate = new Date()
        tDate.setTime(longTime)
        if(cDate.getMonth()!=tDate.getMonth())return false
        if(cDate.getDay()!=tDate.getDay())return false
        if(cDate.getHours()-tDate.getHours()>4)return false
        return true
    }
}
