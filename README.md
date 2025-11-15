# 🏟️ IoT Smart Court – FutFem

O Smart Court FutFem é uma solução IoT completa para monitoramento e gestão de quadras esportivas em tempo real. O sistema integra sensores físicos com uma plataforma web moderna para fornecer dados em tempo real sobre ocupação, condições ambientais e status das quadras. 

---

## ✨ Funcionalidades Principais

- **🏐 Monitoramento em tempo real** de quadras (temperatura, umidade, presença, status de treino)  
- **📍 Mapa interativo** 
- **📡 Integração com o FIWARE Orion Context Broker**  
- **📊 Dashboard com gráficos em tempo real**  
- **🔒 Controle de acesso por função (usuário e admin)**  
- **🌐 Interface responsiva e moderna com TailwindCSS**  

---

## 🧱 Tecnologias Utilizadas

### 🌐 Front-end
- React.js (Vite)
- React Leaflet (mapas)
- Recharts (gráficos)
- Lucide React (ícones)
- TailwindCSS (estilização)

### ☁️ Backend / IoT
- **FIWARE Orion Context Broker** (dados de sensores)
- **json-server** (mock de dados das quadras)
- **ESP32 + Sensor PIR + DHT22**

---  

## ⚙️ Como Executar o Projeto  

### 🔹 1. Clonar o repositório
```bash
git clone https://github.com/Olivanaa/FutFem-IoT.git
cd FutFem-IoT
```

### 🔹 2. Instalar as Dependências

```bash
npm install

```
### 🔹 3. Executar o Servidor JSON (Mock de Quadras)

```bash
json-server --watch db.json --port 3001
```

### 🔹 4. Rodar o Projeto React

```bash
npm run dev
```

## 🧰 Componentes de Hardware (Simulação no Wokwi)

| Componente       | Função                           |
| ---------------- | -------------------------------- |
| ESP32 DevKit v1  | Microcontrolador principal       |
| Sensor PIR       | Detecção de movimento (ocupação) |
| Sensor DHT22     | Leitura de temperatura e umidade |
| Botão            | Controle manual do treino        |

## 💻 Simulação Online

Simule o projeto diretamente no Wokwi:
[Wokwi ESP32 Project](https://wokwi.com/projects/447007515421133825)

**Nota sobre o servidor**:
O broker MQTT 50.17.154.115 é um servidor de demonstração temporário que pode não estar sempre disponível


---

## 👥 Integrantes do Grupo  

- Matheus von Koss Wildeisen - RM: 561539
- Ana Clara Rocha de Oliveira – RM: 564298
- Deivid ruan Marques – RM: 566356
- Felipe Cordeiro - RM: 566518

---
