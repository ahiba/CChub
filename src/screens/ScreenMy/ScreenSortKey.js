
import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import NavigationBar  from '../../components/NavigationBar'
import ScreenCustomKey from './ScreeCustomKey'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../util/ViewUtils'
export default class ScreenSortKey extends Component{
    constructor(props){
        super(props)
        this.languageDao = new LanguageDao(this.props.flag)
        this.dataArray = []
        this.sortResultArray = []
        this.orignalCheckedArray = []
        this.state = {
            checkedArray:[],
            theme:this.props.theme
        }
    }
    componentDidMount(){
        this.loadData()
    }
    onBack =() => {
        if(ArrayUtils.isEquil(this.orignalCheckedArray,this.state.checkedArray)){
            Actions.pop()
            return
        }
        Alert.alert(
            '提示',
            '要保存修改吗？',
            [
                {text: '不保存', onPress: () => {Actions.pop()}, style: 'cancel'},
                {text: '保存', onPress: () => {this.onSave(true)}},
            ],
            { cancelable: false }
        )
    }
    getSortResult = () => {
        this.sortResultArray = ArrayUtils.clone(this.dataArray)
        for(let i=0,len=this.orignalCheckedArray.length;i<len;i++){
            let item = this.orignalCheckedArray[i]
            let index = this.dataArray.indexOf(item)
            this.sortResultArray.splice(index,1,this.state.checkedArray[i])
        }
    }
    onSave = (hasChecked) => {
        if(!hasChecked){
            if(ArrayUtils.isEquil(this.orignalCheckedArray,this.state.checkedArray)){
                Actions.pop()
                return
            }
        }
        this.getSortResult()
        this.languageDao.save(this.sortResultArray)
        Actions.pop()
    }
    loadData = () => {
        this.languageDao.fetch()
            .then((result)=>{
                this.getCheckedItems(result)
            })
            .catch(error=>{
                console.log(error)
            })
    }
    getCheckedItems = (result) => {
        this.dataArray = result
        let checkedArray = []
        for(let i=0,len=result.length;i<len;i++){
            let data = result[i]
            if(data.checked){
                checkedArray.push(data)
            }
        }
        this.setState({
            checkedArray:checkedArray
        })
        this.orignalCheckedArray = ArrayUtils.clone(checkedArray)
    }
    render(){
        let title = this.props.flag === FLAG_LANGUAGE.flag_language?'语言排序':'标签排序'
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}>
            <View>
                <Text style={styles.title}>保存</Text>
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
                <SortableListView
                    style={{ flex: 1 }}
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={e => {
                          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                          this.forceUpdate()
                        }}
                    renderRow={row => <SortCeil data={row} />}
                />
            </View>
        )
    }
}
class SortCeil extends Component{
    render(){
        return(
            <TouchableHighlight
                underlayColor={'#eee'}
                style={{
                  padding: 15,
                  backgroundColor: '#F8F8F8',
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                }}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image source={require('../../../res/images/ic_polular.png')} style={[{width:20,height:20,marginRight:10},this.state.theme.styles.tabBarSelectedIcon]}/>
                    <Text>{this.props.data.name}</Text>
                </View>

            </TouchableHighlight>
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
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    title:{
        fontSize:20,
        color:'white',
        paddingRight:10
    },
})


