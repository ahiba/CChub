
import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Navigator,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    Button,
    Image,
    FlatList,
    Platform,
    TouchableOpacity
} from 'react-native'
import {Toast} from 'antd-mobile'
import {Actions} from 'react-native-router-flux'
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../../expand/dao/DataReposity'
import ProjectModal from '../../modal/ProjectModal'
import Utils from '../../util/Utils'
import ReposityCeil from '../../components/ReposityCeil'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import makeCancelable from '../../util/Cancelable'
import {ACTION_HONE} from '../ScreenTab'
const STATUS_BAR_HEIGHT = 20
const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
let _items = []
export default class ScreenSearch extends Component {
    constructor(props){
        super(props)
        this.favoriteDao  = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.favoriteKeys = []
        this.keys = []
        this.items = []
        this.keyChange = false
        this.state = {
            rightButtonText:'搜索',
            isLoading:false,
            isRefresh: false,//下拉刷新
            isLoadMore: false,//加载更多
            data:[],
            showBottomButton:false,
            theme:this.props.theme
        }
    }
    componentDidMount(){
        this.initKeys()
    }
    componentWillUnmount(){
        if(this.keyChange){
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HONE.A_RESTART)
        }
    }
    saveKey = () => {//将用户输入的key添加到数组中
        let key = this.inputKey
        if(this.checkKeysIsExist(this.keys,key)){
            this.showToast(`${key}已经存在`)
        }else{
            key = {
                'path':key,
                'name':key,
                'checked':true
            }
            this.keys.unshift(key)
            this.languageDao.save(this.keys)
            this.keyChange = true
            this.showToast(`${key.name}保存成功`)
        }
    }
    initKeys = () => {//获取所有标签
        this.languageDao.fetch()
            .then(keys=>{
                this.keys = keys
            })
    }
    checkKeysIsExist = (keys,key) => {//检查用户搜索的keys是否存在数据库中
        for(let i=0,len=keys.length;i<len;i++){
            if(key.toLowerCase()==keys[i].name.toLowerCase()) return true
        }
        return false
    }
    showToast = (msg) => {
        Toast.info(msg,2)
    }
    getUrl = (key) => {
        return API_URL + key + QUERY_STR
    }
    getFavoriteKeys = () => {
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                this.favoriteKeys = keys || []
                this.flushFavoriteState()
            })
            .catch(error => {
                console.log(error)
                this.flushFavoriteState()
            })
    }
    flushFavoriteState = () => {
        let projectModals = []
        let items = _items
        console.log('flus items',items)
        for (let i = 0, len = items.length; i < len; i++) {
            projectModals.push(new ProjectModal(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)))
        }
        this.updateState({
            isLoading:false,
            data: projectModals,
            rightButtonText:'搜索'
        })
    }
    updateState = (dic) => {
        if (!this) return
        this.setState(dic)
    }
    loadData = () => {
        let _that = this
        this.setState({
            isLoading:true
        })
        this.cancelable = makeCancelable( fetch(this.getUrl(this.inputKey)))
        this.cancelable.promise
            .then(response=>response.json())
            .then(responseData=>{
                if(!this||!responseData||!responseData.items||responseData.items.length===0){
                    this.showToast('未找到搜索数据')
                    this.setState({
                        isLoading:false,
                        rightButtonText:'搜索'
                    })
                    return
                }
               _items = responseData.items
                this.getFavoriteKeys()
                if(!this.checkKeysIsExist(this.keys,this.inputKey)){
                    this.setState({
                        showBottomButton:true
                    })
                }
            })
            .catch(e=>{
                console.log(e)
                this.setState({
                    isLoading:false,
                    rigthButtonText:'搜索'
                })
            })
    }
    onPressBack = () => {
        this.refs.input.blur()
        Actions.pop()
    }
    onRightButtonClick = () => {
        if(this.state.rightButtonText==='搜索'){
            this.setState({
                rightButtonText:'取消'
            })
            this.loadData()
        }else{
            this.cancelable.cancel()
            this.setState({
                rightButtonText:'搜索',
                isLoading:false
            })

        }
    }
    renderNavBar = () => {
        let leftButton = ViewUtils.getLeftButton(()=>this.onPressBack())
        let textView = <TextInput style={styles.textInput} ref="input" onChangeText={text=>this.inputKey=text}></TextInput>
        let rightButton = <TouchableOpacity
                                onPress = {()=>{
                                    this.refs.input.blur()
                                    this.onRightButtonClick()
                                    }
                                }
                            >
                                <View style={{marginRight:10}}>
                                    <Text style={{fontSize:18,color:'white'}}>{this.state.rightButtonText}</Text>
                                </View>
                          </TouchableOpacity>
        console.log('this.state.showBottomButton',this.state.showBottomButton)

        return(
            <View style={{
                backgroundColor:this.state.theme.themeColor,
                height:(Platform.OS==='ios')?GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
                flexDirection:'row',
                alignItems:'center'
                }}>
                {leftButton}
                {textView}
                {rightButton}
            </View>
        )
    }
    onSelect = (projectModal) => {
        Actions.REPOSITY_DETAIL({item: projectModal.item})
    }
    onFavorite = (item, isFavorite) => {
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
        } else {
            this.favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }
    createEmptyView = () => {
        return (
            <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:16}}>
                    暂无列表数据，下拉刷新
                </Text>
            </View>
        )
    }
    onRefresh = () => {
        if (!this.state.isRefresh) {//不处于下拉刷新
            this.page = 1
            this.loadData()
        }
    }
    onLoadMore = () => {
        if (!this.state.isLoadMore && this.state.data.length > 0) {
            this.page = this.page + 1
            this.loadData()
        }
    }
    createListItem = (projectModal) => {
        return <ReposityCeil
            key={projectModal.item.id}
            projectModal={projectModal}
            onSelect={()=>{
                    this.onSelect(projectModal)
                }}
            onFavorite={(item,isFavorite)=>{this.onFavorite(item,isFavorite)}}
            theme = {this.state.theme}
        />
    }
    render(){
        let statusBar = null
        if(Platform.OS==='ios'){
            statusBar = <View style={[styles.statusBar,{backgroundColor:this.state.theme.themeColor}]}/>
        }
        let bottomButton = this.state.showBottomButton?
            <TouchableOpacity style={[styles.bottomButton,{backgroundColor:this.state.theme.themeColor}]}
                              onPress = {()=>{this.saveKey()}}
            >
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.title}>
                        添加标签
                    </Text>
                </View>
            </TouchableOpacity>:null
        return (
            <View style={GlobalStyles.root_container}>
                {statusBar}
                {this.renderNavBar()}
                <FlatList
                    data={this.state.data}
                    //item显示的布局
                    renderItem={({item})=>this.createListItem(item)}
                    //空布局
                    ListEmptyComponent={this.createEmptyView}
                    //下拉刷新相关
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.isLoading}
                    //加载更多
                    onEndReached={()=>this.onLoadMore()}
                    onEndReachedThreshold={0.1}
                />
                {bottomButton}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,
    },
    textInput:{
        flex:1,
        height:(Platform.OS==='ios')?30:40,
        borderWidth:(Platform.OS==='ios')?1:0,
        borderColor:'white',
        alignSelf:'center',
        paddingLeft:5,
        marginLeft:5,
        marginRight:10,
        borderRadius:3,
        opacity:0.7,
        color:'white'
    },
    title:{
        fontSize:18,
        color:'white'
    },
    bottomButton:{
        alignItems:'center',
        justifyContent:'center',
        opacity:0.9,
        height:40,
        position:'absolute',
        left:10,
        top:GlobalStyles.window_height-70,
        right:10,
        borderRadius:3,
        zIndex:999
    }

})

