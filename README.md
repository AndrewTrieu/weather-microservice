# Weather Monitoring Application with Microservice Architecture

This is a weather monitoring application with microservice architecture. It is a simple application that allows users to monitor the weather at the user's current location, a location searched by the user, or historical weather data for a location.

## Design and Architecture

### Functional Requirements

- The application retrieves weather data from sensors and stores it in a database.
- The application shows the current weather at the user's current location.
- The application shows the current weather at a location searched by the user.
- The application shows historical weather data for a location.
- The application alerts the user when the weather is bad.
- The application allows the user to set preferences for weather alerts.

### Microservices

- Data collection service: This microservice collects weather data from sensors and stores it in a database. The scope of this microservice is limited to data collection and storage. The communication pattern used by this microservice is asynchronous messaging.
- Current weather service: This microservice retrieves the current weather from the database and shows it to the user. The scope of this microservice is limited to obtaining the user's current location using [IP-API](https://ipapi.co/) and retrieving the current weather from [OpenWeatherMap](https://openweathermap.org/). The communication pattern used by this microservice is synchronous request-response.
- Realtime weather service: This microservice retrieves the current weather of a location based on the search query of the user and shows it to the user. The scope of this microservice is limited to retrieving the current weather of a location from [OpenWeatherMap](https://openweathermap.org/). The communication pattern used by this microservice is synchronous request-response.
- Historical weather service: This microservice retrieves historical weather data for a location based on the search query of the user and shows it to the user. The scope of this microservice is limited to retrieving historical weather data for a location from [OpenWeatherMap](https://openweathermap.org/). The communication pattern used by this microservice is synchronous request-response.
- Alert service: This microservice retrieves the current weather from the sensors and checks if the weather is bad. If it is, the alert service sends an alert to the user. The scope of this microservice is limited to accepting weather data and sending alerts. The communication pattern used by this microservice is asynchronous messaging.
- User preferences service: This microservice allows the user to set preferences for weather alerts. The scope of this microservice is limited to storing user preferences. The communication pattern used by this microservice is asynchronous messaging.

### Communication Patterns

The communication pattern used in the weather monitoring system is a mix of synchronous request/response and asynchronous messaging. Synchronous request/response is used when a microservice needs to get data from another microservice in real-time. Asynchronous messaging is used when a microservice needs to send data to another microservice, but the response can be delayed.

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Frontend
    participant Current weather service
    participant IP-API
    participant Realtime weather service
    participant Historical weather service
    participant OpenWeatherMap
    participant Sensors
    participant Data collection service
    participant Database
    participant Alert service
    participant User preferences service

    Frontend->>Current weather service: GET /current-weather
    Current weather service->>IP-API: GET /json
    IP-API-->>Current weather service: Response with user's current location
    Current weather service->>OpenWeatherMap: GET /weather
    OpenWeatherMap-->>Current weather service: Response with current weather
    Current weather service-->>Frontend: Response with current weather

    Frontend->>Realtime weather service: GET /real-time-weather
    Realtime weather service->>OpenWeatherMap: GET /weather
    OpenWeatherMap-->>Realtime weather service: Response with current weather
    Realtime weather service-->>Frontend: Response with current weather

    Frontend->>Historical weather service: GET /historical-weather
    Historical weather service->>OpenWeatherMap: GET /onecall
    OpenWeatherMap-->>Historical weather service: Response with historical weather
    Historical weather service-->>Frontend: Response with historical weather

    Sensors->>Data collection service: Publish weather data
    Data collection service->>Database: Store weather data

    Sensors->>Alert service: Publish weather data
    Alert service->>Frontend: Send alert if weather is bad

    Frontend->>User preferences service: POST /user-preferences
    User preferences service->>Alert service: Publish user preferences
```

### Architecture Diagram

```mermaid
graph TD
    subgraph User
        A((Frontend))
    end

    subgraph Microservices
        B(Current weather service)
        C(Realtime weather service)
        D(Historical weather service)
        F(User preferences service)
        E(Alert service)
        G(Data collection service)
    end

    subgraph Databases
        H[(Database)]
    end

    subgraph APIs
        I[IP-API]
        J[OpenWeatherMap]
    end

    subgraph Sensors
        K{Sensors}
    end


    A---B
    A---C
    A---D
    A---F

    B---I
    B---J
    C---J
    D---J

    K-->G
    G-->H

    K-->E
    E-->A
    F-->E
```

### Limitations

The limitations around communication for microservices include increased complexity, potential latency, and the need for error handling. Because each microservice is a separate process, there is a potential for increased latency in communication between microservices. Additionally, error handling must be carefully implemented to ensure that failures in one microservice do not propagate to other microservices. Finally, the increased complexity of microservice-based architectures can make them harder to design, develop, deploy, and maintain than monolithic architectures.

## Implementation

### Microservices

Three microservices were implemented:

- Current weather service: This microservice obtains the geographic coordinates of the user's current location using [IP-API](https://ipapi.co/) and retrieves the current weather from [OpenWeatherMap](https://openweathermap.org/). The frontend sends requests to this microservice by using the `GET /current-weather` endpoint. The microservice responds with the current weather in JSON format.

- Realtime weather service: This microservice retrieves the current weather of a location from [OpenWeatherMap](https://openweathermap.org/) based on the given location entered by the user. The frontend sends requests to this microservice by using the `GET /real-time-weather` endpoint. The microservice responds with the current weather in JSON format.

- Historical weather service: This microservice retrieves historical weather data for a location from [OpenWeatherMap](https://openweathermap.org/) based on the given location and UNIX timestamp entered by the user . The frontend sends requests to this microservice by using the `GET /historical-weather` endpoint. The microservice responds with historical weather data in JSON format.

### Dependencies

The following dependencies were used in the implementation of the microservices:

- Node.js
- React
  - express
  - axios
  - dotenv

### Deployment

First navigate to the src directory of the microservice you want to deploy.

```bash
cd src
```

Then run the following command in separate terminals to start the microservices.

```bash
node current.js
node realtime.js
node historical.js
```

And run the following command in the root directory to start the frontend.

```bash
npm start
```
