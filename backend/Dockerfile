FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

COPY build/libs/*.jar app.jar

RUN mkdir -p uploads

ENTRYPOINT ["java", "-jar", "app.jar"]