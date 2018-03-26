package com.github;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.github.invokenative.ShareModule;
import com.microsoft.codepush.react.CodePush;
import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.UMShareAPI;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "github";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);
        super.onCreate(savedInstanceState);
        ShareModule.initSocialSDK(this);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

}
