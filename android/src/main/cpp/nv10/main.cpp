/**
 * @file main.cpp
 * @author Oscar Pineda (o.pineda@coink.com)
 * @brief Archivo principal basico que llama a las funciones de NV10Control
 * @version 1.1
 * @date 2023-05-30
 *
 * @copyright Copyright (c) 2023
 *
 */

//Complacion: g++ -o main main.cpp NV10Control.cpp StateMachine.cpp ValidatorNV10.cpp -I/home/coink/oink/piggybank/connect/coin/Pelicano/spdlog/include/

#include <stdio.h>
#include <stdbool.h>
#include <iostream>
#include <chrono>
#include <thread>

#include "NV10Control.hpp"

using namespace NV10Control;

int main() {

    printf("main() called.\r\n");

    NV10ControlClass NV10ControlObject;

    Response_t Respuesta;
    TestStatus_t Status;
    bool FlagContinue = false;

    int Total = 0;
    bool FlagStacking = false;
    int Seconds = 10;

    static const std::chrono::steady_clock::duration durationNSeconds = std::chrono::seconds(Seconds);
    static std::chrono::steady_clock::time_point startTime = std::chrono::steady_clock::now();
    std::chrono::steady_clock::time_point currentTime = std::chrono::steady_clock::now();

    //Variables externas parametrizadas [Se deben asignar antes de iniciar el log y de conectar]
    NV10ControlObject.Path = "logs/NV10.log";
    NV10ControlObject.LogLvl = 1;
    NV10ControlObject.MaximumPorts = 10;

    NV10ControlObject.InitLog();

    Respuesta = NV10ControlObject.Connect();
    std::cout<<"Connect retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;

    if (Respuesta.StatusCode == 200){
        FlagContinue = true;
    }

    Respuesta = NV10ControlObject.CheckDevice();
    std::cout<<"CheckDevice retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
    Status = NV10ControlObject.TestStatus();
    std::cout<<"TestStatus retorna. Version: "<<Status.Version<<" Device: "<<Status.Device<<std::endl;
    std::cout<<"TestStatus retorna. ErrorType: "<<Status.ErrorType<<" ErrorCode: "<<Status.ErrorCode<<std::endl;
    std::cout<<"TestStatus retorna. Message: "<<Status.Message<<" AditionalInfo: "<<Status.AditionalInfo<<std::endl;
    std::cout<<"TestStatus retorna. Priority: "<<Status.Priority<<std::endl;

    int MaxIters = 500;
    int MaxItersDiv2 = 250;

    if (FlagContinue){

        Respuesta = NV10ControlObject.StartReader();
        std::cout<<"StartReader retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;

        int i=0;
        BillError_t RespuestaBE;

        while(i<MaxIters){

            RespuestaBE = NV10ControlObject.GetBill();

            if (RespuestaBE.StatusCode != 302) {
                std::cout<<"GetCoin retorna. StatusCode: "<<RespuestaBE.StatusCode<<" Bill: "<<RespuestaBE.Bill<<" Message: "<<RespuestaBE.Message<<std::endl;
                if ((RespuestaBE.StatusCode >= 400) & (RespuestaBE.StatusCode != 508)) {
                    std::cout<<"Error. Saliendo..."<<std::endl;
                    i = MaxIters;
                }
                else if (RespuestaBE.StatusCode == 508){
                    std::cout<<"Error grave con el billete pero se debe guardar......"<<std::endl;
                    Total = Total + RespuestaBE.Bill;
                    std::cout<<"Saliendo"<<std::endl;
                    i = MaxIters;
                }
                else if (RespuestaBE.StatusCode == 307){
                    static std::chrono::steady_clock::time_point startTime = std::chrono::steady_clock::now();
                    FlagStacking = true;
                }
                else{
                    if ((RespuestaBE.StatusCode == 308) | (RespuestaBE.StatusCode == 312)){
                        Total = Total + RespuestaBE.Bill;
                        startTime = currentTime;
                        FlagStacking = false;
                    }
                    else{
                        if (FlagStacking){
                            std::chrono::steady_clock::time_point currentTime = std::chrono::steady_clock::now();
                            std::chrono::steady_clock::duration elapsedTime = currentTime - startTime;
                            if (elapsedTime >= durationNSeconds){
                                Respuesta = NV10ControlObject.Reject();
                                if (Respuesta.StatusCode == 206){
                                    std::cout<<"Se regreso el billete porque no se pudo apilar"<<std::endl;
                                }
                                else{
                                    std::cout<<"Error, no se pudo regresar el billete, guardandolo y saliendo"<<std::endl;
                                    Total = Total + RespuestaBE.Bill;
                                    i = MaxIters;
                                }
                                startTime = currentTime;
                            }
                        }
                    }
                }
            }
            if (i == MaxItersDiv2){
                std::cout<<"-----------------------------------------------------------------------------------------------------"<<std::endl;
                std::cout<<"Quitando billetes de 50.000 y de 100.000....."<<std::endl;
                Respuesta = NV10ControlObject.ModifyChannels(159);
                std::cout<<"Modify channels retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
                std::cout<<"-----------------------------------------------------------------------------------------------------"<<std::endl;
            }

            i++;
        }

        Respuesta = NV10ControlObject.StopReader();
        std::cout<<"StopReader retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;

        std::cout<<"Total depositado: "<<Total<<" COP "<<std::endl;

        Respuesta = NV10ControlObject.CheckDevice();
        std::cout<<"CheckDevice retorna: "<<Respuesta.StatusCode<<" Y "<<Respuesta.Message<<std::endl;
        Status = NV10ControlObject.TestStatus();
        std::cout<<"TestStatus retorna. Version: "<<Status.Version<<" Device: "<<Status.Device<<std::endl;
        std::cout<<"TestStatus retorna. ErrorType: "<<Status.ErrorType<<" ErrorCode: "<<Status.ErrorCode<<std::endl;
        std::cout<<"TestStatus retorna. Message: "<<Status.Message<<" AditionalInfo: "<<Status.AditionalInfo<<std::endl;
        std::cout<<"TestStatus retorna. Priority: "<<Status.Priority<<std::endl;
    }

    return 0;
}
