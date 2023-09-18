package com.coink.plugins.nv10;

import com.getcapacitor.JSObject;

import java.util.HashMap;
import java.util.Map;

public class BillChannels extends JSObject {

  private final Map<Integer, int[]> channelsBits = new HashMap<>();
  private final boolean[] channelBitState = {true, true, true, true, true, true, true, true};

  private int value = 0;

  public BillChannels() {
    super();
    channelsBits.put(1_000, new int[]{1});
    channelsBits.put(2_000, new int[]{2});
    channelsBits.put(5_000, new int[]{3});
    channelsBits.put(10_000, new int[]{4});
    channelsBits.put(20_000, new int[]{5});
    channelsBits.put(50_000, new int[]{6});
    channelsBits.put(100_000, new int[]{7});
    value = convertBitsToInt(channelBitState);
    reset();
  }

  public void reset() {
    for (int value : channelsBits.keySet()) {
      String key = Integer.toString(value);
      put(key, true);
    }
  }

  public void setChannel(int channel, boolean active) {
    int[] channelIndexes = channelsBits.get(channel);
    if (channelIndexes == null) return;
    for (int channelIdx : channelIndexes) {
      if (channelIdx > channelBitState.length) continue;
      channelBitState[channelIdx] = active;
    }
    value = convertBitsToInt(channelBitState);
    put(Integer.toString(channel), active);
  }

  public int getValue() {
    return value;
  }

  private int convertBitsToInt(boolean[] bits) {
    int result = 0;
    for (boolean bit : bits) {
      result = (result << 1) | (bit ? 1 : 0);
    }
    return result;
  }

}
