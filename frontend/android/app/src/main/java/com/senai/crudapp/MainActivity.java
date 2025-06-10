package com.senai.crudapp;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getBridge().getWebView().getSettings().setDomStorageEnabled(true);
    }
}
