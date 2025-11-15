# TrackViewer (.NET 6 / React 19.2)
Zadanie rekrutacyjne

## 🚀 Uruchomienie Backendu

Backend znajduje się w folderze `TrackViewer/TrackViewer.API`.

### 1. Konfiguracja bazy danych

1.  Upewnij się, że serwer PostgreSQL działa.
2.  Stwórz ręcznie nową, pustą bazę danych (np. o nazwie `track_db`).
3.  Otwórz plik `TrackViewer/TrackViewer.API/appsettings.json`.
4.  Zaktualizuj `ConnectionStrings` swoimi danymi (Host, Port, Database, Username, Password).

    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Host=localhost;Port=5432;Database=track_db;Username=postgres;Password=postgres"
    }
    ```

### 2. Migracje bazy danych

Otwórz terminal w folderze `TrackViewer/TrackViewer.API` i wykonaj komendę, aby utworzyć tabele w bazie danych:

```bash
dotnet ef database update
```

### 3. Start API
W folderze `TrackViewer/TrackViewer.API` wykonaj polecenia
```bash
dotnet restore
dotnet watch run --urls="https://localhost:7058"
```

---

## 🖥️ Uruchomienie Frontendu

Frontend znajduje się w folderze `TrackViewer/TrackViewer.Frontend`.

### 1. Instalacja zależności

Otwórz terminal w folderze `TrackViewer/TrackViewer.Frontend` i uruchom:

```bash
npm install
```

### 2. Start frontendu
W tym samym folderze (`TrackViewer/TrackViewer.Frontend`) uruchom serwer
```bash
npm run dev
```
