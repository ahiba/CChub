//路由配置文件
import React from 'react'
import {StackNavigator} from 'react-navigation'
// 引入页面组件
import ScreenPopular from "../screens/ScreenPopular";
import ScreenTrend from "../screens/ScreenTrend";
// import ScreenBottomTab from '../screens/ScreenBottomTab'
import ScreenCollect from '../screens/ScreenCollect'
import ScreenMy from '../screens/ScreenMy'
import ScreenWelcome from '../screens/ScreenWelcome'
import ScreenTab from '../screens/ScreenTab'
import {
    Button
} from 'react-native'
// 配置路由
const AppNavigator = StackNavigator({
    ScreenWelcome:{
      screen:ScreenWelcome

    },
    // ScreenBottomTab:{
    //   screen:ScreenBottomTab
    // },
    ScreenTab:{
      screen:ScreenTab
    },
    ScreenPopular: {
        screen: ScreenPopular,
        navigationOptions:{
            headerTitle:'详情',
            headerBackTitle:null,
            headerLeft: (
                <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#fff"
                />
            ),
            headerRight: (
                <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#fff"
                />
            ),
        }
    },
    ScreenTrend: {
        screen: ScreenTrend
    },
    ScreenCollect:{
        screen:ScreenCollect
    },
    ScreenMy:{
        screen:ScreenMy
    }
});

export default ()=><AppNavigator/>