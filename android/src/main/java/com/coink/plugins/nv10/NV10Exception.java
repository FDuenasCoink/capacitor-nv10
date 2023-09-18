package com.coink.plugins.nv10;

import hardware.nv10.Response_t;

public class NV10Exception extends Exception {
  private String code;

  public NV10Exception(Response_t error) {
    super(error.getMessage());
    this.code = Integer.toString(error.getStatusCode());
  }

  public String getCode() {
    return code;
  }
}
