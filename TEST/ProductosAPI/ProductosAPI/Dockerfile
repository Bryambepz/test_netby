FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["ProductosAPI/ProductosAPI.csproj", "ProductosAPI/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Models/Models.csproj", "Models/"]

RUN dotnet restore "./ProductosAPI/ProductosAPI.csproj"

COPY . .
WORKDIR "/src/ProductosAPI"
RUN dotnet build "./ProductosAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build /p:UseAppHost=false
RUN dotnet publish "./ProductosAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "ProductosAPI.dll"]