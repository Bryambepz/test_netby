FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY . .

RUN dotnet restore "./TransaccionAPI.csproj"
RUN dotnet build "./TransaccionAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build
RUN dotnet publish "./TransaccionAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TransaccionAPI.dll"]