import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Navigator,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavigationBar from '../../components/NavigationBar'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ViewUtils from '../../util/ViewUtils'
import CheckBox from 'react-native-check-box'
import ArrayUtils from '../../util/ArrayUtils'
export default class ScreenCustomKey extends React.Component{
    constructor(props){
        super(props)
        this.isRemoveKey = this.props.isRemoveKey?true:false
        this.languageDao = new LanguageDao(this.props.flag)
        this.changeValues = []
        this.state={
            dataArray:[],
            theme:this.props.theme
        }
    }
    componentDidMount(){
        this.loadData()
    }
    onClick = (data)=>{
        console.log('456 data',data)
        if(!this.isRemoveKey){
            data.checked = !data.checked
        }
        ArrayUtils.updataArray(this.changeValues,data)
    }
    loadData = () => {
        this.languageDao.fetch()
            .then(result=>{
                console.log('custom key result',result)
                this.setState({
                    dataArray:result
                })
            })
            .catch(error=>{
                console.log(error)
            })
    }
    onBack = () => {
        if(this.changeValues.length===0){
            Actions.pop()
            return
        }
        Alert.alert(
            '提示',
            '要保存修改吗？',
            [
                {text: '不保存', onPress: () => { Actions.pop()}, style: 'cancel'},
                {text: '保存', onPress: () => {this.onSave()}},
            ],
            { cancelable: false }
        )

    }
    onSave = () =>{
        if(this.changeValues.length===0){
            Actions.pop()
            return
        }
        if(this.isRemoveKey){
            for(let i=0,len=this.changeValues.length;i<len;i++){
                ArrayUtils.remove(this.state.dataArray,this.changeValues[i])
            }
        }
        this.languageDao.save(this.state.dataArray)
        Actions.pop()
    }
    renderCheckBox = (data) =>{
        console.log('123 data',data)
        let isChecked = this.isRemoveKey?false:data.checked
        let leftText = data.name
        return <CheckBox
            isChecked={isChecked}
            style={{flex:1,padding:10}}
            onClick={()=>{
                        console.log('传递给onClick的data',data)
                        this.onClick(data)
                    }}
            leftText={leftText}
            checkedImage={<Image style={this.state.theme.styles.tabBarSelectedIcon} source={require('./img/ic_check_box.png')}/>}
            unCheckedImage={<Image  style={this.state.theme.styles.tabBarSelectedIcon} source={require('./img/ic_check_box_outline_blank.png')}/> }
        />
    }
    renderView = () => {
        if(!this.state.dataArray||this.state.dataArray.length===0) return;
        // return <Text style={{width:400,height:400}}>{JSON.stringify(this.state.dataArray)}</Text>
        let len = this.state.dataArray.length;
        let  views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i+1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )

        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2===0?this.renderCheckBox(this.state.dataArray[len-2]):null}
                    {this.renderCheckBox(this.state.dataArray[len-1])}
                </View>
            </View>
        )
        return views;
    }
    render(){
        let title = this.isRemoveKey?'标签移除':'自定义标签'
        title = this.props.flag === FLAG_LANGUAGE.flag_language?'自定义语言':title
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}>
            <View>
                <Text style={styles.title}>{this.isRemoveKey?'移除':'保存'}</Text>
            </View>
        </TouchableOpacity>
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar =
            <NavigationBar
                title={title}
                statusBar = {statusBar}
                style = {this.state.theme.styles.navBar}
                leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
                rightButton={rightButton}
            />
        return(
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    tips:{
        fontSize:19
    },
    title:{
        fontSize:20,
        color:'white',
        paddingRight:10
    },
    line:{
        height:0.3,
        backgroundColor:'darkgray'
    },
    item:{
        flexDirection:'row',
        alignItems:'center'
    }
})
