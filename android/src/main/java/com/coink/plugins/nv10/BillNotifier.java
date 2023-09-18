package com.coink.plugins.nv10;

import com.getcapacitor.JSObject;

public interface BillNotifier {
  void onInsertBill(JSObject data);
  void onInsertBillWarning(JSObject data);
}
