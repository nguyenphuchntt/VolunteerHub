FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install Maven directly to avoid mvnw line-ending issues on Windows
RUN apk add --no-cache maven

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src src

RUN mvn package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=build /app/target/*.jar app.jar

COPY ./images /app/uploads

RUN chown -R spring:spring /app/uploads && chmod -R 775 /app/uploads

USER spring:spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
