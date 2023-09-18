// 0. --------------- ESTRUCTURAS DE RESPUESTA --------------------//

struct Response_t{
    int StatusCode;
    std::string Message;
};

struct BillError_t{
    int StatusCode;
    int Bill;
    std::string Message;
};

struct TestStatus_t{
    std::string Version;
    int Device;
    int ErrorType; 
    int ErrorCode;
    std::string Message; 
    std::string AditionalInfo;
    int Priority; 
};

// 1. --------------- BILLETERO NV10 --------------------//

/**
 * @brief Funcion que corre los primeros estados de la maquina de estados y deja listo el dispositivo para las siguientes operaciones
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 200 - Billetero OK. Se sincronizo exitosamente
 * @return 404 - DefaultError
 * @return 501 - Fallo con el billetero. No responde
 * @return 502 - Fallo en la conexion con el billetero, puerto no encontrado
 */
Response_t Connect();

/**
 * @brief Funcion que revisa el estado del billetero
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 201 - Billetero OK. Se reviso exitosamente
 * @return 404 - DefaultError
 * @return 501 - Fallo con el billetero. No responde
 */
Response_t CheckDevice();

/**
 * @brief Funcion que inicia la lectura de billetes en el billetero
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 202 - Billetero OK. Listo para iniciar a leer billetes
 * @return 203 - Billetero OK. Start reader corrio nuevamente. Listo para iniciar a leer billetes
 * @return 501 - Fallo con el billetero. No responde
 */
Response_t StartReader();

/**
 * @brief Funcion que busca el ultimo billete leido

 * @brief Hay 3 posibles flujos para operar con los billetes:

 * @brief Flujo 1: READ_0 -> REJECTING -> REJECTED [El Billete es detectado pero no puede ser leido, por lo que es rechazado y luego retirado por el usuario]
 * @brief Los codigos de respuesta del flujo 1 son respectivamente:
 * @brief Flujo 1: 303 -> 305 -> 306

 * @brief Flujo 2: READ_0 -> READ_Bill -> STACKING -> CREDIT/STACKED -> STACKED [El Billete es detectado, leido, acreditado y apilado]
 * @brief En el segundo flujo puede acreditar y apilar a la vez (312) o acreditar (309) y luego apilar (308)
 * @brief Los codigos de respuesta del flujo 2 son respectivamente:
 * @brief Flujo 2 v1: 303 -> 304 -> 307 -> 312
 * @brief Flujo 2 v2: 303 -> 304 -> 307 -> 309 -> 308 [Casi nunca sucede]

 * @brief Flujo 3: READ_0 -> READ_Bill -> REJECTING -> REJECTED [El Billete es detectado pero esta inhibido, por lo que es rechazado y luego retirado por el usuario]
 * @brief Los codigos de respuesta del flujo 3 son respectivamente:
 * @brief Flujo 2: 303 -> 311 -> 305 -> 306

 * @return BillError_t Estructura que contiene un codigo de estado, un valor de billete ('0' si aun no ha sido leido) y un mensaje asociado
 * @return 301 - 0         - Billetero OK. Comando repetido, la respuesta ya fue vista anteriormente
 * @return 302 - 0         - Billetero OK. No hay nueva informacion
 * @return 303 - 0         - Leyendo billete. Se desconoce su valor
 * @return 304 - [Billete] - Leyendo billete. Billete detectado exitosamente
 * @return 305 - 0         - Billete rechazado. Esperando a que el usuario retire el billete
 * @return 306 - 0         - Billete rechazado. Usuario retiro el billete
 * @return 307 - [Billete] - Billete leido. Apilando billete
 * @return 308 - [Billete] - Billete apilado
 * @return 309 - [Billete] - Billete acreditado, listo para apilar
 * @return 310 - [Billete] - Billetero OK. Billete apilado. No hay nueva informacion
 * @return 311 - [Billete] - Billete inhibido. Esperando a que el usuario retire el billete
 * @return 312 - [Billete] - Billete acreditado y apilado
 * @return 404 - 0         - DefaultError
 * @return 501 - 0         - Fallo con el billetero. No responde
 * @return 503 - 0         - No se ha iniciado el lector (StartReader)
 * @return 504 - 0         - Falla en el comando. Comando retorna: [Mensaje de error]
 * @return 505 - 0         - No hay billete. Comando no puede ser procesado
 * @return 506 - 0         - Fallo en la respuesta. Longitud invalida
 * @return 507 - 0         - Error en secuencia del billetero. El anterior billete se pudo perder
 * @return 508 - [Billete] - Billete acreditado, pero con error: [Mensaje de evento adicional]
 * @return 509 - 0         - Billete apilado pero no se sabe su valor
 * @return 510 - [Billete] - Error grave en el Billetero: [Mensaje de evento] con  el billete: [Billete]
 * @return 511 - 0         - Fallo con el codigo. Canal de billete desconocido
 */
BillError_t GetBill();

/**
    Canales del Billetero

    {1,1000},    //Antiguo 
    {2,2000},    //Antiguo y nuevo
    {3,5000},    //Antiguo y nuevo
    {4,10000},   //Antiguo y nuevo
    {5,20000},   //Antiguo y nuevo
    {6,50000},   //Antiguo y nuevo     
    {7,100000},  //Nuevo     
    {8,0},       // 

 * @brief Funcion que cambia la mascara de inhibicion de los canales a desactivar
 * @brief Si la mascara de inhibicion = 255 (11111111), todos los canales estaran activados
 * @brief Si la mascara de inhibicion = 240 (11110000), se inhibiran los 4 ultimos canales
 * @param InhibitMask1 Mascara de inhibicion de los canales 1 al 8 (0 = Canal Inhibido / 1 = Canal no inhibido)
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 204 - Billetero OK. Canales inhibidos correctamente
 * @return 404 - DefaultError
 */
Response_t ModifyChannels(int InhibitMask1,int InhibitMask2);

/**
 * @brief Funcion que detiene la lectura de billetes en el billetero
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 205 - Billetero OK. StopReader corrio exitosamente
 * @return 511 - Fallo con el billetero. No se pudo desactivar
 * @return 512 - Fallo con el billetero. No se pudo revisar
 * @return 513 - No se puede detener el lector porque no se ha iniciado
 */
Response_t StopReader();

/**
 * @brief Funcion que rechaza un billete que esta en custodia dentro del billetero
 * @return Response_t Estructura que contiene un codigo de estado y un mensaje
 * @return 206 - Billetero OK. StopReader corrio exitosamente
 * @return 501 - Fallo con el billetero. No responde
 */
Response_t Reject();

/**
    "Version":"1.0",
    "Device":"1",
    "ErrorType":"1",
    "ErrorCode":"10",
    "Message":"Null event",
    "Priority":"1",
    "AditionalInfo":"Previous error solved",
    "Date":"11/05/2023 11:55" [Se adiciona desde el front]

 * @brief Funcion que entrega el ultimo estado del billetero
 * @return TestStatus_t Estructura que contiene la version del codigo, el numero de dispositivo, el ultimo tipo de error, el ultimo codigo de error, el ultimo mensaje de error, 
 * @return la prioridad del error y una informacion adicional
 * @return Posibles codigos y mensajes en el archivo "DataErrors.cpp"
 */
TestStatus_t TestStatus();

/*
// 2. --------------- PANTALLA DE MANTENIMIENTO--------------------//

Billetero NV10

1. Boton para revisar conexion -> Connect()
2. Revisa estado general -> CheckDevice() y luego TestStatus()
3. Iniciar a leer billetes -> StartReader()
4. Terminar de leer billetes -> StopReader()

//3. --------------- FLUJO DEL BILLETERO --------------------//

1. Billetero no conectado

- La revision de rutina de cada minuto y la que se hace antes de mostrar las opcion de deposito al usuario deberian cambiar el estado del billetero a desconectado
- La maquina deberia enviar un correo al detectar que no esta conectado

2. Billetero conectado

- La revision de rutina de cada minuto y la que se hace antes de mostrar las opcion de deposito al usuario deberian cambiar el estado del billetero a desconectado
- La maquina deberia enviar un correo al detectar que el billetero esta fallando

    Paso 1.
    
    Para obtener los datos precisos del Billetero hay que correr CheckDevice() antes del TestConnection

    TestConnection (Estado:Bloqueado / Estado:Falla en comunicacion)
        Cambiar estado del billetero a desactivado
        Enviar correo al detectar que esta fallando
        Termina flujo del billetero
    TestConnection (Estado:OK)
        Continuar al paso 2

    Paso 2.

    Revision anterior a deteccion de billetes (Estado:Falla)
        Cancelar lectura, mandar un aviso con el mensaje de que no se pueden meter billetes y enviar correo al detectar que esta fallando
        Termina flujo del billetero
    Revision anterior a deteccion de billetes (Estado:OK)
        Continuar al paso 3

    Paso 3.

    Lectura de billetes (Estado:Falla leve)
        Mostrar mensaje en pantalla dependiendo de la falla
        Tipos de falla:
            Billetero con canales deshabilitados
            Billetero deshabilitado

    Lectura de billetes (Estado:Falla grave)
        Tipos de falla:
            Apilador lleno
            Atasco
            Intento de fraude
        Cancelar lectura, depositar, cambiar el estado del billetero a deshabilitado y enviar correo al detectar que esta fallando
    Lectura de billetes (Estado:OK)
        Continuar en el ciclo e ir al paso 4 una vez finalizado el deposito

    Paso 4.

    Revisar estado final del billetero despues de la operacion (Estado:Falla)
        Cambiar el estado del billetero a deshabilitado y enviar correo al detectar que esta fallando
    Revisar estado final del billetero despues de la operacion (Estado:OK)
        Continuar al paso 1
*/
