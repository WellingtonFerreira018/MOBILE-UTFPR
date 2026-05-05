# Aula 08 – Persistência Local com AsyncStorage

## Objetivo
Compreender como persistir dados localmente em aplicações React Native usando AsyncStorage,
diferenciando armazenamento temporário vs. persistente e aplicando boas práticas.

---

## Arquivos criados nesta aula

| Arquivo | Responsabilidade |
|---|---|
| `src/services/storage-service.ts` | Encapsula todas as chamadas ao AsyncStorage (setItem, getItem, removeItem) |
| `src/hooks/use-storage.ts` | Hook que hidrata o estado na montagem e expõe ações reativas |
| `src/screens/storage-lesson-screen.tsx` | Tela de demonstração com string simples e array JSON |

---

## Fluxo de dados

```
storageService (AsyncStorage)
       ↕
  useStorage (hook)
       ↕
  StorageLessonScreen (UI)
```

---

## Conceitos demonstrados

### 1. String simples – `setItem` / `getItem`
```ts
// Salvar
await AsyncStorage.setItem('@my-app:user:name', 'Ana');

// Recuperar
const name = await AsyncStorage.getItem('@my-app:user:name');
```

### 2. Objeto/Array – `JSON.stringify` / `JSON.parse`
```ts
// Salvar array de notas
await AsyncStorage.setItem('@my-app:notes', JSON.stringify(notes));

// Recuperar
const raw = await AsyncStorage.getItem('@my-app:notes');
const notes = JSON.parse(raw ?? '[]');
```

### 3. Remover dados – `removeItem`
```ts
await AsyncStorage.removeItem('@my-app:notes');
```

### 4. Hidratação com `useEffect`
```ts
useEffect(() => {
  const loadData = async () => {
    const notes = await storageService.getNotes();
    setNotes(notes);
  };
  loadData();
}, []); // roda uma vez ao montar o componente
```

---

## Boas práticas aplicadas

- **Prefixo nas chaves** → `@my-app:` para evitar colisão com outras libs
- **try/catch em todos os métodos** → erros tratados no service e propagados como `Error`
- **Camada de serviço** → AsyncStorage nunca é chamado diretamente na tela
- **Hook reativo** → tela não conhece AsyncStorage, apenas chama `addNote`, `removeNote`
- **Dados sensíveis** → NÃO usar AsyncStorage para senhas/tokens; usar Keychain/SecureStore

---

## Como testar a persistência

1. Rode o app: `npx expo start`
2. Selecione a lição **"Aula 08 – Persistência Local"** no seletor
3. Salve um nome e adicione notas
4. Feche completamente o app e reabra
5. Os dados devem estar exatamente como foram deixados ✅
