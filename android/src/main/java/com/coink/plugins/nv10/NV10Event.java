package com.coink.plugins.nv10;

import com.getcapacitor.JSObject;

import hardware.nv10.BillError_t;

public class NV10Event extends JSObject {

  public NV10Event(BillError_t bill) {
    super();
    int value = bill.getBill();
    put("value", value);
  }

  private NV10Event(BillError_t bill, String type) {
    super();
    String message = bill.getMessage();
    int code = bill.getStatusCode();
    if (type.equals("error")) {
      JSObject error = new JSObject();
      error.put("message", message);
      error.put("code", code);
      put("error", error);
    } else if (type.equals("warning")) {
      put("message", message);
      put("code", code);
    }
  }

  private NV10Event(NV10Exception e) {
    super();
    String message = e.getMessage();
    int code = Integer.parseInt(e.getCode());
    JSObject error = new JSObject();
    error.put("message", message);
    error.put("statusCode", code);
    put("error", error);
  }

  public static NV10Event fromException(NV10Exception e) {
    return new NV10Event(e);
  }

  public static NV10Event error(BillError_t bill) {
    return new NV10Event(bill, "error");
  }

  public static NV10Event warning(BillError_t bill) {
    return new NV10Event(bill, "warning");
  }
}
