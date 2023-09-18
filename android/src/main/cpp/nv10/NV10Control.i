%module NV10Control
%include "std_string.i"
%include "ValidatorNV10.hpp"
%include "StateMachine.hpp"
%include "NV10Control.hpp"
%{
#include "ValidatorNV10.hpp"
#include "StateMachine.hpp"
#include "NV10Control.hpp"
using namespace NV10Control;
using namespace StateMachine;
using namespace ValidatorNV10;
%}
