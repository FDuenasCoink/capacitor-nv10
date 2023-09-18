package com.coink.plugins.nv10;

import com.getcapacitor.JSObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import hardware.nv10.Response_t;
import hardware.nv10.TestStatus_t;

public class NV10Response extends JSObject {
  private final String message;
  private final int statusCode;
  private BillChannels channels;

  public NV10Response(Response_t data) {
    super();
    this.message = data.getMessage();
    this.statusCode = data.getStatusCode();
    put("message", message);
    put("statusCode", statusCode);
  }

  public NV10Response(Response_t data, BillChannels channels) {
    super();
    this.message = data.getMessage();
    this.statusCode = data.getStatusCode();
    this.channels = channels;
    put("message", message);
    put("statusCode", statusCode);
    put("channels", channels);
  }

  public NV10Response(TestStatus_t status) {
    super();
    Date now = Calendar.getInstance().getTime();
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
    String date = df.format(now);

    message = status.getMessage();
    statusCode = status.getErrorCode();

    put("version", status.getVersion());
    put("device", status.getDevice());
    put("errorType", status.getErrorType());
    put("errorCode", status.getErrorCode());
    put("message", status.getMessage());
    put("aditionalInfo", status.getAditionalInfo());
    put("priority", status.getPriority());
    put("date", date);
  }

  public int getStatusCode() {
    return statusCode;
  }

  public String getMessage() {
    return message;
  }

  public BillChannels getChannels() {
    return channels;
  }
}
