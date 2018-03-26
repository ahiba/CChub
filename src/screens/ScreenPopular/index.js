
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
    TouchableOpacity
} from 'react-native'
import {MenuProvider} from 'react-native-popup-menu'
import {Toast} from 'antd-mobile'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DataReposity,{FLAG_STORAGE} from '../../expand/dao/DataReposity'
import ReposityCeil from '../../components/ReposityCeil'
import NavigationBar from '../../components/NavigationBar'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ProjectModal from '../../modal/ProjectModal'
import Utils from '../../util/Utils'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import MoreMenu,{MORE_MENU} from '../../common/MoreMenu'
import BaseComponent from '../../common/BaseComponent'
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
export default class ScreenPopular extends BaseComponent {
    // 自定义当前页面路由配置，后面介绍的TabNavigator也使用这个对象中的属性
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state = {
            languages:[],
            theme:this.props.theme
        }
        this.loadData()
    }
    loadData = () => {
        this.languageDao.fetch()
            .then(result=>{
                console.log('popular result ',result)
                this.setState({
                    languages:result
                })
            })
            .catch(error=>{
                console.log(error)
            })
    }
    renderRightButton = () => {
        let _menus = [MORE_MENU.About,MORE_MENU.About_Author,MORE_MENU.Custom_Key]
        return(
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity
                    onPress = {()=>Actions.SEARCH({theme:this.state.theme})}
                >
                    <View style={{padding:5,marginRight:8}}>
                        <Image source={require('../../../res/images/ic_search_white_48pt.png')} style={{width:24,height:24}}/>
                    </View>
                </TouchableOpacity>
                <View style={{width:24,height:24,marginRight:10}}>
                    <MoreMenu
                        menus = {_menus}
                        theme = {this.state.theme}
                    />
                </View>
            </View>
        )
    }
    render() {
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar =
            <NavigationBar
            title="最热"
            statusBar = {statusBar}
            style = {this.state.theme.styles.navBar}
            rightButton = {this.renderRightButton()}
        />

        let contents = this.state.languages.length>0?
                    <ScrollableTabView
                        tabBarBackgroundColor={this.state.theme.themeColor}
                         tabBarInactiveTextColor="mintcream"
                        tabBarActiveTextColor="white"
                          tabBarUnderlineStyle = {{backgroundColor:'#e7e7e7',height:2}}
                         renderTabBar={()=><ScrollableTabBar/>}
                        >
                           {this.state.languages.map((element,i)=>{
                               return  element.checked?<PopularTab tabLabel={element.name} theme={this.state.theme} key={i} {...this.props}>{element.name}</PopularTab>:null
                                 })}
                    </ScrollableTabView> : null

        return (
                        <MenuProvider>
                         <View style={styles.container}>
                             {navigationBar}
                             {contents}
                         </View>
                        </MenuProvider>
        )
    }
}
class PopularTab extends React.Component {
    constructor(props) {
        super(props)
        this.dataReposity = new DataReposity(FLAG_STORAGE.flag_popular)
        this.page = 1 //当前页面
        this.state = {
            data: [],//列表数据结构
            isRefresh: false,//下拉刷新
            isLoadMore: false,//加载更多
            favoriteKeys:[],
            theme:this.props.theme
        }
    }

    componentDidMount() {
        this.loadData()
    }

    showToast = (msg) => {
        Toast.info(msg, 1)
    }
    getFavoriteKeys = () => {
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if(keys){
                    this.updateState({
                        favoriteKeys:keys
                    })
                }
                console.log('trending keys',keys)
                this.flushFavoriteState()
            })
            .catch(error=>{
                console.log(error)
                this.flushFavoriteState()
            })
    }
    flushFavoriteState = () => {
        let projectModals = []
        let items = this.items
        console.log('flushFavoriteState111 items',items)
        if(!items){
            if(this.page==1){
                this.updateState({
                    isRefresh:false
                })
                return
            }else{
                this.updateState({
                    isLoadMore:false
                })
                return
            }
        }
        console.log('flushFavoriteState222 items',items)
        for(let i=0,len=items.length;i<len;i++){
            projectModals.push(new ProjectModal(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)))
        }
        if(this.page==1){
            this.updateState({
                data:projectModals,
                isRefresh:false
            })
        }else{
            this.updateState({
                isLoadMore:false,
                data:this.state.data.concat(projectModals)
            })
        }
    }
    updateState = (dic) => {
        if(!this) return
        this.setState(dic)
    }
    loadData = () => {
        if(this.page==1){
            this.setState({
                isRefresh:true
            })
        }else{
            this.setState({
                isLoadMore:true
            })
        }

        let url = this.getUrl(this.props.tabLabel,this.page)
        console.log('loaddata url',url)
        this.dataReposity.fetchReposity(url)
            .then(result => {
                console.log('loaddata result',result)
               this.items = result && result.items ? result.items : result ? result : []
                // this.flushFavoriteState()
                this.getFavoriteKeys()
                if (result && result.update_date && !this.dataReposity.checkDate(result.update_date)) {
                    return this.dataReposity.fetchNetReposity(url)
                }
            })
            .then(items => {
                if (!items && items.length == 0) return
                this.items = items
                // this.flushFavoriteState()
                this.getFavoriteKeys()
            })
            .catch(error => {
                if(this.page==1){
                    this.setState({
                        isRefresh:false
                    })
                }else{
                    this.setState({
                        isLoadMore:false
                    })
                }
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }
    getUrl = (key,page) => {
        return URL + key + QUERY_STR + `&${page}`
    }
    onSelect = (projectModal) => {
        Actions.REPOSITY_DETAIL({item: projectModal.item,theme:this.props.theme})
    }
    onFavorite = (item,isFavorite) => {
        if(isFavorite){
            favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item))
        }else{
            favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }
    createListItem = (projectModal) => {
        return <ReposityCeil
            key = {projectModal.item.id}
            projectModal = {projectModal}
            onSelect={()=>{
                    this.onSelect(projectModal)
                }}
            onFavorite = {(item,isFavorite)=>{this.onFavorite(item,isFavorite)}}
            theme = {this.props.theme}
        />
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

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    //item显示的布局
                    renderItem={({item})=>this.createListItem(item)}
                    //空布局
                    ListEmptyComponent={this.createEmptyView}
                    //下拉刷新相关
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.isRefresh}
                    //加载更多
                    onEndReached={()=>this.onLoadMore()}
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})

