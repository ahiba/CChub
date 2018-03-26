import React,{Component} from 'react'
import {
    AsyncStorage
} from 'react-native'
import ThemeFactory,{ThemeFlags} from '../../../res/styles/ThemeFactory'
const THEME_KEY = 'theme_key'
export default class ThemeDao{
   getTheme(){//获取当前的主题
       return new Promise((resolve,reject)=>{
           AsyncStorage.getItem(THEME_KEY,(error,result)=>{
                if(error){
                    reject(error)
                    return
                }
                if(!result){
                    this.saveTheme(ThemeFlags.Default)
                    result = ThemeFlags.Default
                }
               resolve(ThemeFactory.createTheme(result))
           })
       })

   }
   saveTheme(themeFlag){//保存主题标识
       AsyncStorage.setItem(THEME_KEY,themeFlag,(error=>{

       }))

   }
}


