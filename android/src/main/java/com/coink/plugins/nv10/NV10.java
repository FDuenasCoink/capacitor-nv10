package com.coink.plugins.nv10;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginConfig;

import hardware.nv10.BillError_t;
import hardware.nv10.NV10ControlClass;
import hardware.nv10.Response_t;
import hardware.nv10.TestStatus_t;

public class NV10 implements Runnable{

    static {
        System.loadLibrary("NV10_Wrapper");
    }

    private static final String LOG_FILE = "NV10.log";


    private final NV10ControlClass nv10 = new NV10ControlClass();
    private BillNotifier notifier;
    private final BillChannels channels = new BillChannels();
    private final CustomThread thread = new CustomThread(this);

    private long stackingTimer = 0;

    public NV10(Plugin plugin) {
        PluginConfig config = plugin.getConfig();
        int maximumPorts = config.getInt("maximumPorts", 10);
        int logLevel = config.getInt("logLevel", 1);

        String packagePath = plugin.getActivity().getApplicationContext().getFilesDir().getAbsolutePath();
        String logPath = packagePath + "/" + LOG_FILE;

        nv10.setPath(logPath);
        nv10.setLogLvl(logLevel);
        nv10.setMaximumPorts(maximumPorts);
        nv10.InitLog();
    }

    public NV10Response connect() throws NV10Exception {
        thread.pause();
        Response_t response = nv10.Connect();
        thread.resume();
        int status = response.getStatusCode();
        if (status != 200) {
            throw new NV10Exception(response);
        }
        return new NV10Response(response);
    }

    public NV10Response checkDevice() throws NV10Exception {
        thread.pause();
        Response_t response = nv10.CheckDevice();
        thread.resume();
        int status = response.getStatusCode();
        if (status != 201) {
            throw new NV10Exception(response);
        }
        return new NV10Response(response);
    }

    public NV10Response reject() throws NV10Exception {
        Response_t response = nv10.Reject();
        int status = response.getStatusCode();
        if (status != 206) {
            throw new NV10Exception(response);
        }
        return new NV10Response(response);
    }

    public NV10Response testStatus() {
        thread.pause();
        TestStatus_t response = nv10.TestStatus();
        thread.resume();
        return new NV10Response(response);
    }

    public NV10Response modifyChannel(int channel, boolean active) throws NV10Exception {
        channels.setChannel(channel, active);
        thread.pause();
        Response_t response = nv10.ModifyChannels(channels.getValue());
        thread.resume();
        int status = response.getStatusCode();
        if (status != 204) {
            throw new NV10Exception(response);
        }
        return new NV10Response(response, channels);
    }

    public NV10Response startReader(BillNotifier notifier) throws NV10Exception {
        thread.stop();
        Response_t response = nv10.StartReader();
        int status = response.getStatusCode();
        if (status != 202 && status != 203) {
            throw new NV10Exception(response);
        }
        channels.reset();
        this.notifier = notifier;
        thread.start();
        return new NV10Response(response);
    }

    public NV10Response stopReader() throws NV10Exception {
        thread.stop();
        this.notifier = null;
        channels.reset();
        Response_t response = nv10.StopReader();
        int status = response.getStatusCode();
        if (status != 205) {
            throw new NV10Exception(response);
        }
        return new NV10Response(response);
    }

    @Override
    public void run() {
        BillError_t bill = nv10.GetBill();
        int status = bill.getStatusCode();

        if (status == 302) return;

        if (status == 508) {
            // notify the bill and the error. Then end the thread.
            NV10Event event = new NV10Event(bill);
            NV10Event error = NV10Event.error(bill);
            this.notifier.onInsertBill(event);
            this.notifier.onInsertBill(error);
            thread.breakProcess();
            return;
        }

        if (status >= 400) {
            // some error happened. notify and end the thread.
            NV10Event error = NV10Event.error(bill);
            this.notifier.onInsertBill(error);
            thread.breakProcess();
            return;
        }

        if (status == 305 || status == 306 || status == 311) {
            NV10Event warning = NV10Event.warning(bill);
            this.notifier.onInsertBillWarning(warning);
            return;
        }

        if (status == 307) {
            // Start timer for stack bill (10 seconds).
            NV10Event warning = NV10Event.warning(bill);
            this.notifier.onInsertBillWarning(warning);
            stackingTimer = System.currentTimeMillis();
            return;
        }

        if (status == 308 || status == 312) {
            // Everything Ok. Notify the event.
            stackingTimer = 0;
            NV10Event event = new NV10Event(bill);
            this.notifier.onInsertBill(event);
            return;
        }

        if (stackingTimer != 0) {
            // If timer is active, check if time is greater than 10 seconds.
            long currentTime = System.currentTimeMillis();
            long difference = currentTime - stackingTimer;
            if (difference < 10_000) return;
            try {
                this.reject();
                stackingTimer = 0;
            } catch (NV10Exception e) {
                NV10Event error = NV10Event.fromException(e);
                this.notifier.onInsertBill(error);
                thread.breakProcess();
                return;
            }
        }

    }

}
