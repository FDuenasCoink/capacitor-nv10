
# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

# Declares and names the project.
cmake_minimum_required(VERSION 3.22.1)
project(NV10)

set(SWIG_I_FILE "NV10Control.i")
set(JAVA_GEN_PACKAGE "hardware.nv10")
string(REPLACE "." "/" JAVA_GEN_SUBDIR ${JAVA_GEN_PACKAGE})
# set(JAVA_GEN_DIR ${Project_SOURCE_DIR}/src/main/java/${JAVA_GEN_SUBDIR})
set(JAVA_GEN_DIR ${CMAKE_SOURCE_DIR}/../java/${JAVA_GEN_SUBDIR})

set(CMAKE_VERBOSE_MAKEFILE 1) # Use 1 for debugging, 0 for release

# Sets some warning/error conditions and which version of C/C++ to use
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -std=c11")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -std=c++14")

# Include a location to the header files
include_directories(./)

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

# Note: One could use a 'GLOB' here, but newly added source files won't auto-regen build files
# After adding files, you'd need to 'touch' the CMakeLists.txt to re-gen
set(SOURCE_FILES ValidatorNV10.cpp StateMachine.cpp NV10Control.cpp)

add_library( # Sets the name of the library.
             NV10

             # Sets the library as a shared library.
             SHARED

             # Provides a relative path to your source file(s).
             ${SOURCE_FILES} )

# Searches for a specified prebuilt library and stores the path as a
# variable. Because CMake includes system libraries in the search path by
# default, you only need to specify the name of the public NDK library
# you want to add. CMake verifies that the library exists before
# completing its build.

find_library( # Sets the name of the path variable.
              log-lib

              # Specifies the name of the NDK library that
              # you want CMake to locate.
              log )

# Fail the build if SWIG is not found - Ensure SWIG is installed and on the system path
# TODO: Does this run for EACH architecture?
find_package(SWIG REQUIRED)
include(${SWIG_USE_FILE})

# Remove old java files, in case we don't need to generate some of them anymore
file(REMOVE_RECURSE ${JAVA_GEN_DIR})

# Ensure file recognized as C++ (otherwise, exported as C file)
set_property(SOURCE NV10Control.i PROPERTY CPLUSPLUS ON)

# Setup SWIG flags and locations
set(CMAKE_SWIG_FLAGS -c++ -package ${JAVA_GEN_PACKAGE})
set(CMAKE_SWIG_OUTDIR ${JAVA_GEN_DIR})

# Export a wrapper file to Java, and link with the created C++ library
swig_add_library(NV10_Wrapper LANGUAGE java SOURCES ${SWIG_I_FILE})
swig_link_libraries(NV10_Wrapper NV10)

# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.

target_link_libraries( # Specifies the target library.
                       NV10

                       # Links the target library to the log library
                       # included in the NDK.
                       ${log-lib} spdlog)
