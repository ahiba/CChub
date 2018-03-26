
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
    FlatList
} from 'react-native'
import {Toast} from 'antd-mobile'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DataReposity,{FLAG_STORAGE} from '../../expand/dao/DataReposity'
import ReposityCeil from '../../components/ReposityCeil'
import NavigationBar from '../../components/NavigationBar'
import ProjectModal from '../../modal/ProjectModal'
import Utils from '../../util/Utils'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import TrendingCeil from '../../components/TrendingCeil'
import MoreMenu,{MORE_MENU} from '../../common/MoreMenu'
import {MenuProvider} from 'react-native-popup-menu'
import BaseComponent from '../../common/BaseComponent'
export default class ScreenCollect extends BaseComponent {
    // 自定义当前页面路由配置，后面介绍的TabNavigator也使用这个对象中的属性
    constructor(props) {
        super(props);
        this.state = {
            theme:this.props.theme
        }
    }
    renderRightButton = () => {
        let _menus = [MORE_MENU.About,MORE_MENU.About_Author,MORE_MENU.Custom_Key]
        return(
            <View style={{width:24,height:24,marginRight:10}}>
                <MoreMenu
                    menus = {_menus}
                    theme = {this.state.theme}
                />
            </View>
        )
    }
    render() {
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar =
            <NavigationBar
                title="收藏"
                statusBar = {statusBar}
                style = {this.state.theme.styles.navBar}
                rightButton = {this.renderRightButton()}
            />
        let contents =
            <ScrollableTabView
                tabBarBackgroundColor={this.state.theme.themeColor}
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle = {{backgroundColor:'#e7e7e7',height:2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >

                   <FavoriteTab tabLabel='最热' theme={this.state.theme} flag={FLAG_STORAGE.flag_popular} {...this.props}/>
                   <FavoriteTab tabLabel='趋势' theme={this.state.theme} flag={FLAG_STORAGE.flag_trending} {...this.props}/>
            </ScrollableTabView>
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
class FavoriteTab extends React.Component {
    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(this.props.flag)
        this.page = 1 //当前页面
        this.state = {
            data: [],//列表数据结构
            isRefresh: false,//下拉刷新
            isLoadMore: false,//加载更多
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.loadData()
    }

    showToast = (msg) => {
        Toast.info(msg, 1)
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
        this.favoriteDao.getAllItems()
            .then(items=>{
                console.log('collect getAllItems items',items)
                let resultData = []
                for(let i=0,len=items.length;i<len;i++){
                    resultData.push(new ProjectModal(items[i],true))
                }
                if(this.page==1){
                    this.updateState({
                        isRefresh:false,
                        data:resultData
                    })
                }else{
                    this.updateState({
                        isLoadMore:false,
                        data:resultData
                    })
                }

            })
            .catch(error=>{
                console.log(error)
                if(this.page==1){
                    this.updateState({
                        isRefresh:false
                    })
                }else{
                    this.updateState({
                        isLoadMore:false
                    })
                }
            })
    }
    onSelect = (projectModal) => {
        Actions.REPOSITY_DETAIL({item: projectModal.item,theme:this.props.theme})
    }
    onFavorite = (item,isFavorite) => {
        if(isFavorite){
            this.favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item))
        }else{
            this.favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }
    createListItem = (projectModal) => {
        let CeilComponent = this.props.flag === FLAG_STORAGE.flag_popular?ReposityCeil:TrendingCeil
        return <CeilComponent
            key = {this.props.flag === FLAG_STORAGE.flag_popular?projectModal.item.id:projectModal.item.fullName}
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
        // if (!this.state.isLoadMore && this.state.data.length > 0) {
        //     this.page = this.page + 1
        //     this.loadData()
        // }
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
