# Additional clean files
cmake_minimum_required(VERSION 3.16)

if("${CONFIG}" STREQUAL "" OR "${CONFIG}" STREQUAL "Debug")
  file(REMOVE_RECURSE
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-nv10/android/src/main/java/hardware/nv10/NV10Control.java"
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-nv10/android/src/main/java/hardware/nv10/NV10ControlJAVA_wrap.cxx"
  "/Users/coink/Desktop/projects/oink-hardware-plugins/capacitor-nv10/android/src/main/java/hardware/nv10/NV10ControlJNI.java"
  )
endif()
