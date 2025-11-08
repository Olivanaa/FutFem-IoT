#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ======== DEFINIÇÕES DE PINOS ========
#define PIR_ENTRADA 17         
#define PIR_SAIDA 26         
#define DHTPIN 14
#define DHTTYPE DHT22
#define BOTAO_TREINO 4
#define LED_VERDE 19

// ======== DHT ========
DHT dht(DHTPIN, DHTTYPE);

// ======== WI-FI E MQTT CONFIG ========
const char* default_SSID = "Wokwi-GUEST"; 
const char* default_PASSWORD = ""; 
const char* default_BROKER_MQTT = "50.17.154.115"; 
const int default_BROKER_PORT = 1883; 
const char* default_TOPICO_SUBSCRIBE = "/TEF/device011/cmd"; 
const char* default_TOPICO_PUBLISH_1 = "/TEF/device011/attrs"; 
const char* default_TOPICO_PUBLISH_2 = "/TEF/device011/attrs/t"; 
const char* default_TOPICO_PUBLISH_3 = "/TEF/device011/attrs/u"; 
const char* default_TOPICO_PUBLISH_4 = "/TEF/device011/attrs/p"; 
const char* default_TOPICO_PUBLISH_5 = "/TEF/device011/attrs/a"; 
const char* default_ID_MQTT = "fiware_001"; 
const char* topicPrefix = "device011";

// Variáveis para configurações editáveis
char* SSID = const_cast<char*>(default_SSID);
char* PASSWORD = const_cast<char*>(default_PASSWORD);
char* BROKER_MQTT = const_cast<char*>(default_BROKER_MQTT);
int BROKER_PORT = default_BROKER_PORT;
char* TOPICO_SUBSCRIBE = const_cast<char*>(default_TOPICO_SUBSCRIBE);
char* TOPICO_PUBLISH_1 = const_cast<char*>(default_TOPICO_PUBLISH_1);
char* TOPICO_PUBLISH_2 = const_cast<char*>(default_TOPICO_PUBLISH_2);
char* TOPICO_PUBLISH_3 = const_cast<char*>(default_TOPICO_PUBLISH_3);
char* TOPICO_PUBLISH_4 = const_cast<char*>(default_TOPICO_PUBLISH_4);
char* TOPICO_PUBLISH_5 = const_cast<char*>(default_TOPICO_PUBLISH_5);
char* ID_MQTT = const_cast<char*>(default_ID_MQTT);

WiFiClient espClient;
PubSubClient MQTT(espClient);

// ======== VARIÁVEIS ========
int pessoas = 0;
float temp, umid;
bool estadoEntrada = LOW;
bool botaoAnterior = LOW;
bool treinoAtivo = false;

// ======== FUNÇÕES ========
void initWiFi() {
    delay(10);
    Serial.println("------Conexao WI-FI------");
    Serial.print("Conectando-se na rede: ");
    Serial.println(SSID);
    Serial.println("Aguarde");
    reconectWiFi();
}

void reconectWiFi() {
    if (WiFi.status() == WL_CONNECTED)
        return;
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println();
    Serial.println("Conectado com sucesso na rede ");
    Serial.print(SSID);
    Serial.println("IP obtido: ");
    Serial.println(WiFi.localIP());
}

void initMQTT() {
  MQTT.setServer(BROKER_MQTT, BROKER_PORT);
}

void reconnectMQTT() {
  while (!MQTT.connected()) {
    Serial.print("* Tentando conectar ao broker MQTT: ");
    Serial.println(BROKER_MQTT);
    if (MQTT.connect(ID_MQTT)) {
      Serial.println("Conectado ao broker MQTT!");
      MQTT.subscribe(TOPICO_SUBSCRIBE);
    } else {
      Serial.println("Falha na conexão, tentando novamente...");
      delay(2000);
    }
  }
}

void VerificaConexoesWiFIEMQTT() {
    if (!MQTT.connected())
        reconnectMQTT();
    reconectWiFi();
}

// ======== SENSOR DHT22 ========
void sensorTempUmid(){     
  temp = dht.readTemperature();    
  umid = dht.readHumidity();                    

  String mensagemTemp = String(temp);
  MQTT.publish(default_TOPICO_PUBLISH_2, mensagemTemp.c_str());
  String mensagemUmid = String(umid);
  MQTT.publish(default_TOPICO_PUBLISH_3, mensagemUmid.c_str());
}

// ======== SENSOR pir-motion ========
void sensorPresenca() {
  int leituraEntrada = digitalRead(PIR_ENTRADA);
  
  if (leituraEntrada == 1) {
    digitalWrite(LED_VERDE, HIGH);
    if(estadoEntrada == LOW){
      pessoas++;
      Serial.println("➡️  Pessoa entrou na quadra");
      Serial.print("Total de pessoas: ");
      Serial.println(pessoas);
      estadoEntrada = HIGH;
    }
  }else{
    digitalWrite(LED_VERDE, LOW);
    if (estadoEntrada == HIGH){      
      Serial.println("Motion ended!");
      estadoEntrada = LOW;
    }
  }

  String mensagemPresenca = String(pessoas);
  MQTT.publish(default_TOPICO_PUBLISH_4, mensagemPresenca.c_str());
}

// ======== Treino Ativo ========
void treino() {
  bool leituraBotao = digitalRead(BOTAO_TREINO);

  if (leituraBotao == LOW && botaoAnterior == HIGH) {  
    treinoAtivo = !treinoAtivo; 
    delay(300);  
  }
  botaoAnterior = leituraBotao;

  String mensagemTreino = treinoAtivo ? "true" : "false";
  MQTT.publish(default_TOPICO_PUBLISH_5, mensagemTreino.c_str());
}


void setup() {
  Serial.begin(115200);
  pinMode(PIR_ENTRADA, INPUT);
  pinMode(PIR_SAIDA, INPUT);
  pinMode(BOTAO_TREINO, INPUT_PULLUP);
  pinMode(LED_VERDE, OUTPUT);
  dht.begin();  

  Serial.println("⏳ Aguardando estabilização dos sensores PIR...");
  delay(5000);

  initWiFi();
  initMQTT();
}

void loop() {
  VerificaConexoesWiFIEMQTT();
  MQTT.loop();

  sensorTempUmid();
  sensorPresenca();
  treino();

}