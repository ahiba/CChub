import React,{Component} from 'react'
import {
    AsyncStorage
} from 'react-native'
export let FLAG_LANGUAGE = {flag_language:'flag_language_language',flag_key:'flag_language_key'}
import keys from '../../../res/data/keys.json'
import langs     from '../../../res/data/langs.json'
export default class languageDao{
    constructor(flag){
        this.flag = flag
    }
    fetch(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if(error){
                    reject(error)
                }else{
                    if(result){
                        try{
                            resolve(JSON.parse(result))
                        }catch(e){
                            reject(e)
                        }
                    }else{
                        let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langs
                        this.save(data)
                        resolve(data)
                    }
                }
            })
        })
    }
    save(objectData){
        let stringData=JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag,stringData,(error)=>{

        })
    }
}
