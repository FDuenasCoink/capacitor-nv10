package com.coink.plugins.nv10;

import java.util.concurrent.atomic.AtomicBoolean;

public class CustomThread implements Runnable {

  private final Runnable runnable;

  private final AtomicBoolean exit = new AtomicBoolean(false);
  private final AtomicBoolean paused = new AtomicBoolean(false);

  private final AtomicBoolean threadActive = new AtomicBoolean(false);
  private final AtomicBoolean pausedActive = new AtomicBoolean(false);

  private final Object lock = new Object();

  public CustomThread(Runnable runnable) {
    this.runnable = runnable;
  }

  public void start() {
    if (threadActive.get()) {
      resume();
      return;
    }
    exit.set(false);
    Thread t = new Thread(this);
    t.start();
  }

  public void stop() {
    exit.set(true);
    resume();
    while (threadActive.get());
  }

  public void pause() {
    if (!threadActive.get()) return;
    paused.set(true);
    while (!pausedActive.get());
  }

  public void resume() {
    if (!threadActive.get()) return;
    synchronized (lock) {
      paused.set(false);
      lock.notifyAll();
    }
  }

  public void breakProcess() {
    exit.set(true);
    resume();
  }

  @Override
  public void run() {
    threadActive.set(true);
    while (!exit.get()) {
      this.runnable.run();
      synchronized (lock) {
        if (!paused.get()) continue;
        try {
          pausedActive.set(true);
          lock.wait();
          pausedActive.set(false);
        } catch (InterruptedException e) {
          e.printStackTrace();
          break;
        }
      }
    }
    threadActive.set(false);
  }


}
