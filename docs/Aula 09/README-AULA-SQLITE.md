# Aula 09 – Persistência Local II: SQLite

## Objetivo
Compreender o uso de bancos de dados locais em aplicações React Native utilizando SQLite
para armazenamento estruturado, cobrindo instalação, CRUD completo e integração com a UI.

---

## Arquivos criados nesta aula

| Arquivo | Responsabilidade |
|---|---|
| `src/services/sqlite-service.ts` | Abre o banco, cria a tabela e expõe os métodos CRUD |
| `src/hooks/use-tasks.ts` | Hidrata o state, expõe ações e gerencia filtros |
| `src/screens/sqlite-lesson-screen.tsx` | Tela com CRUD completo de tarefas + filtros |

---

## Fluxo de dados

```
expo-sqlite (tasks.db)
       ↕
  sqliteService (CRUD)
       ↕
    useTasks (hook)
       ↕
  SqliteLessonScreen (UI)
```

---

## SQL demonstrado

### CREATE TABLE
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  done       INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### INSERT (adicionar tarefa)
```sql
INSERT INTO tasks (title) VALUES (?);
```

### SELECT (buscar tarefas)
```sql
SELECT * FROM tasks ORDER BY id DESC;
-- Com filtro:
SELECT * FROM tasks WHERE done = 0;
SELECT * FROM tasks WHERE done = 1;
```

### UPDATE (marcar como concluída)
```sql
UPDATE tasks SET done = ? WHERE id = ?;
```

### DELETE (remover tarefa)
```sql
DELETE FROM tasks WHERE id = ?;
```

---

## API do expo-sqlite (SDK 54 – nova API async/await)

> ⚠️ O slide usa a API antiga com callbacks (`db.transaction`). O Expo SDK 50+ introduziu
> a nova API assíncrona, muito mais limpa. Ambas funcionam, mas a nova é a recomendada.

```ts
// Abrir banco
const db = await SQLite.openDatabaseAsync('tasks.db');

// Criar tabela (sem retorno)
await db.execAsync(`CREATE TABLE IF NOT EXISTS tasks (...)`);

// INSERT / UPDATE / DELETE
const result = await db.runAsync('INSERT INTO tasks (title) VALUES (?)', title);
console.log(result.lastInsertRowId); // id do novo registro

// SELECT múltiplos
const rows = await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY id DESC');

// SELECT único
const row = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
```

### API antiga (como mostrado no slide)
```ts
const db = SQLite.openDatabase('tasks.db');

db.transaction(tx => {
  tx.executeSql(
    'SELECT * FROM tasks',
    [],
    (_, { rows }) => setTasks(rows._array),
    (_, error) => console.error(error)
  );
});
```

---

## AsyncStorage vs SQLite – Quando usar cada um?

| Critério | AsyncStorage | SQLite |
|---|---|---|
| Tipo | Chave-valor | Relacional (tabelas) |
| Consultas | `filter()` no JS | SQL completo (WHERE, ORDER BY) |
| Volume | Pequeno | Grande |
| Relacionamentos | Manual | Foreign Keys |
| Quando usar | Preferências, tokens, flags | Listas, registros, modo offline |

---

## Como testar a persistência

1. Rode o app: `npx expo start`
2. Selecione **"Aula 09 – Persistência Local II"** no seletor
3. Adicione algumas tarefas, marque como concluídas
4. Feche completamente o app e reabra
5. Todas as tarefas estarão lá — armazenadas no arquivo `tasks.db` do dispositivo ✅
