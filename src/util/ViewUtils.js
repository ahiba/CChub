import React from 'react'
import {
    TouchableOpacity,
    Image,
    View,
    StyleSheet,
    TouchableHighlight,
    Text
} from 'react-native'
export default class VeiwUtils{
    //获取设置页的Item
    static getSettingItem(callBack,icon,text,tintStyle,expandableIcon){
        return <TouchableHighlight
            onPress = {callBack}
        >
            <View style={styles.setting_item_container}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={icon} style={[{width:22,height:22,marginRight:10},tintStyle]}/>
                    <Text>{text}</Text>
                </View>
                <Image source={expandableIcon?expandableIcon:require('../../res/images/ic_tiaozhuan.png')} style={[{width:22,height:22,marginRight:10},tintStyle]}/>
            </View>
        </TouchableHighlight>
    }
    static getLeftButton(callBack){
        return(
            <TouchableOpacity
                style={{padding:8}}
                onPress = {callBack}
            >
                <Image
                    style={{width:26,height:26,tintColor:'white'}}
                    source={require('../../res/images/ic_arrow_back_white_36pt.png')}
                />
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    setting_item_container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        height:60,
        backgroundColor:'white'
    }
})
