package com.coink.plugins.nv10;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NV10")
public class NV10Plugin extends Plugin implements BillNotifier {

    private static final String BILL_INSERT_EVENT = "billInsert";
    private static final String BILL_WARNING_EVENT = "billInsertWarning";
    private static final  String TAG = "NV10";

    private NV10 implementation;

    @Override
    public void load() {
        super.load();
        implementation = new NV10(this);
    }

    @PluginMethod()
    public void connect(PluginCall call) {
        try {
            NV10Response response =  implementation.connect();
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void checkDevice(PluginCall call) {
        try {
            NV10Response response = implementation.checkDevice();
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void modifyChannel(PluginCall call) {
        int channel = call.getInt("channel", 0);
        boolean active = call.getBoolean("active", true);
        try {
            NV10Response response = implementation.modifyChannel(channel, active);
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void testStatus(PluginCall call) {
        NV10Response status = implementation.testStatus();
        call.resolve(status);
    }

    @PluginMethod()
    public void reject(PluginCall call) {
        try {
            NV10Response response = implementation.reject();
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void init(PluginCall call) {
        try {
            implementation.connect();
            implementation.checkDevice();
            call.resolve();
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void startReader(PluginCall call) {
        try {
            NV10Response response = implementation.startReader(this);
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @PluginMethod()
    public void stopReader(PluginCall call) {
        try {
            NV10Response response = implementation.stopReader();
            call.resolve(response);
        } catch (NV10Exception e) {
            String message = e.getMessage();
            String code = e.getCode();
            call.reject(message, code);
        }
    }

    @Override
    public void onInsertBill(JSObject data) {
        notifyListeners(BILL_INSERT_EVENT, data);
    }

    @Override
    public void onInsertBillWarning(JSObject data) {
        notifyListeners(BILL_WARNING_EVENT, data);
    }

}
