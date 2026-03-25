# 🏗️ Arquitetura Profissional - React Native

Este projeto demonstra uma **arquitetura completa e profissional** para aplicações React Native, seguindo as melhores práticas de organização, separação de responsabilidades e código limpo.

---

## 📂 Estrutura do Projeto

```
my-app/
├── App.tsx                          # Componente raiz com navegação por tabs
├── components/                      # Componentes da aula anterior
│   └── Aula 03/                    # Exemplos didáticos (JSX, Props, etc)
├── src/                            # Código-fonte organizado
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── button.tsx             # Botão customizado
│   │   ├── card.tsx               # Card para exibir conteúdo
│   │   ├── error-message.tsx      # Mensagem de erro
│   │   ├── loading.tsx            # Indicador de carregamento
│   │   └── tab-navigation.tsx     # Navegação por abas
│   ├── hooks/                      # Hooks customizados
│   │   └── use-fetch.ts           # Hook para requisições HTTP
│   ├── screens/                    # Telas da aplicação
│   │   ├── examples-screen.tsx    # Tela com exemplos da aula
│   │   ├── home-screen.tsx        # Tela de posts da API
│   │   └── users-screen.tsx       # Tela de usuários da API
│   └── services/                   # Serviços e integrações
│       ├── api.ts                 # Cliente Axios e endpoints
│       └── analytics-service.ts   # Simulação de SDK de analytics
└── package.json
```

---

## 🎯 Conceitos Demonstrados

### 1. **Separação de Responsabilidades**

Cada parte do código tem uma responsabilidade clara:

- **Components**: UI reutilizável e apresentacional
- **Screens**: Telas completas que compõem a aplicação
- **Services**: Lógica de negócio e integração externa
- **Hooks**: Lógica reutilizável com estado

### 2. **Baixo Acoplamento**

Os componentes não dependem diretamente uns dos outros:

```typescript
// ✅ Bom: Componente recebe dados via props
<Card title="Título" subtitle="Subtítulo" />

// ❌ Ruim: Componente busca dados internamente
<Card /> // busca dados dentro do componente
```

### 3. **Alta Coesão**

Cada módulo faz uma coisa e faz bem:

- `api.ts` → apenas requisições HTTP
- `useFetch` → apenas gerenciamento de estado de fetch
- `Card` → apenas apresentação visual

---

## 🔧 Componentes Principais

### **1. Services (Serviços)**

#### `api.ts` - Cliente HTTP com Axios

```typescript
// Configuração centralizada
const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});

// Interceptors para logging
apiClient.interceptors.request.use(...)
apiClient.interceptors.response.use(...)

// Funções tipadas
export const apiService = {
  async getPosts(): Promise<Post[]> { ... }
  async getUsers(): Promise<User[]> { ... }
}
```

**Vantagens:**
- Configuração única e reutilizável
- Tipagem forte com TypeScript
- Logging automático de requisições
- Fácil manutenção e testes

#### `analytics-service.ts` - Simulação de SDK

```typescript
class AnalyticsService {
  logEvent(eventName: string, properties?: EventProperties) { ... }
  logScreenView(screenName: string) { ... }
  logUserAction(action: string, details?: EventProperties) { ... }
}

export const analyticsService = new AnalyticsService();
```

**Uso:**
```typescript
analyticsService.logScreenView("home_screen");
analyticsService.logUserAction("post_clicked", { post_id: 123 });
```

---

### **2. Hooks Customizados**

#### `useFetch` - Gerenciamento de Estado de Requisições

```typescript
const { data, loading, error, refetch } = useFetch(
  () => apiService.getPosts(),
  []
);
```

**Benefícios:**
- Reutilização de lógica de fetch
- Gerenciamento automático de loading/error
- Integração com analytics
- Função de refetch para atualizar dados

**Responsabilidades:**
- ✅ Gerenciar estado (data, loading, error)
- ✅ Executar requisição
- ✅ Tratar erros
- ❌ Não sabe de onde vêm os dados (recebe função)

---

### **3. Components (Componentes Reutilizáveis)**

#### `Card` - Componente de Apresentação

```typescript
<Card
  title="Título"
  subtitle="Subtítulo"
  onPress={() => console.log("Clicou")}
>
  <Text>Conteúdo do card</Text>
</Card>
```

**Características:**
- Aceita children para flexibilidade
- onPress opcional (TouchableOpacity condicional)
- Estilo consistente em toda aplicação

#### `Loading` - Indicador de Carregamento

```typescript
<Loading message="Carregando dados..." size="large" color="#007AFF" />
```

#### `ErrorMessage` - Mensagem de Erro

```typescript
<ErrorMessage 
  message="Falha ao carregar dados" 
  onRetry={() => refetch()} 
/>
```

#### `Button` - Botão Customizado

```typescript
<Button 
  title="Salvar" 
  onPress={handleSave}
  variant="primary"
  loading={isLoading}
/>
```

**Variantes:** `primary`, `secondary`, `outline`

---

### **4. Screens (Telas)**

#### `HomeScreen` - Lista de Posts

```typescript
export function HomeScreen() {
  const { data: posts, loading, error, refetch } = useFetch(
    () => apiService.getPosts(),
    []
  );

  useEffect(() => {
    analyticsService.logScreenView("home_screen");
  }, []);

  // Renderização com Loading/Error/Success
}
```

**Padrão de Renderização:**
1. Se `loading` → mostra `<Loading />`
2. Se `error` → mostra `<ErrorMessage />`
3. Se sucesso → mostra lista com `<FlatList />`

#### `UsersScreen` - Lista de Usuários

Similar ao HomeScreen, mas com dados de usuários.

#### `ExamplesScreen` - Exemplos da Aula

Mantém os exemplos didáticos da aula anterior integrados na nova arquitetura.

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Screen    │  (Usa hook useFetch)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   useFetch  │  (Chama service)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ apiService  │  (Faz requisição HTTP)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     API     │  (JSONPlaceholder)
└─────────────┘
```

**Fluxo de Volta:**
```
API → apiService → useFetch → Screen → Component
```

---

## 📊 Integração com Analytics

Todos os eventos importantes são logados:

```typescript
// Visualização de tela
analyticsService.logScreenView("home_screen");

// Ação do usuário
analyticsService.logUserAction("post_clicked", { post_id: 123 });

// Sucesso de fetch
analyticsService.logEvent("data_fetch_success");

// Erro
analyticsService.logError("Network error", "fetch_error");
```

---

## 🎨 Padrões de Design Utilizados

### **1. Container/Presentational Pattern**

- **Container (Screen)**: Gerencia estado e lógica
- **Presentational (Component)**: Apenas apresentação

### **2. Custom Hooks Pattern**

- Extrai lógica reutilizável em hooks
- Facilita testes e manutenção

### **3. Service Layer Pattern**

- Separa lógica de negócio da UI
- Facilita mudança de API ou provider

### **4. Composition Pattern**

- Componentes compostos com children
- Flexibilidade sem prop drilling

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start

# Executar em plataforma específica
npm run android
npm run ios
npm run web
```

---

## 📱 Navegação

O app usa **navegação por tabs** simples (sem biblioteca externa):

- **🎓 Exemplos**: Exemplos didáticos da aula anterior
- **📱 Posts**: Lista de posts da API
- **👥 Usuários**: Lista de usuários da API

---

## 🧪 Testabilidade

A arquitetura facilita testes:

```typescript
// Testar hook isoladamente
const { result } = renderHook(() => useFetch(mockFetchFn));

// Testar service com mock
jest.mock('axios');
const posts = await apiService.getPosts();

// Testar componente
render(<Card title="Test" />);
```

---

## 💡 Boas Práticas Aplicadas

### ✅ **Código**
- Tipagem forte com TypeScript
- Funções puras quando possível
- Nomes descritivos e claros
- Comentários apenas quando necessário

### ✅ **Arquitetura**
- Separação de responsabilidades
- Baixo acoplamento
- Alta coesão
- Reutilização de código

### ✅ **Performance**
- Memoização quando necessário
- FlatList para listas grandes
- RefreshControl para pull-to-refresh

### ✅ **UX**
- Loading states
- Error handling
- Feedback visual
- Pull to refresh

---

## 🎓 Conceitos para Sala de Aula

### **Progressão Didática Sugerida:**

1. **Aula 1-3**: Fundamentos (JSX, Componentes, Props)
2. **Aula 4**: Introdução a Services e API
3. **Aula 5**: Custom Hooks e Estado
4. **Aula 6**: Arquitetura Completa

### **Exercícios Sugeridos:**

1. Adicionar nova tela com comentários (`/comments`)
2. Criar novo hook `useLocalStorage`
3. Implementar filtro/busca na lista
4. Adicionar tela de detalhes ao clicar no card
5. Implementar cache de dados

---

## 📚 Recursos Adicionais

- [React Native Docs](https://reactnative.dev/)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🔑 Principais Aprendizados

1. **Organização é fundamental** - Estrutura clara facilita manutenção
2. **Separação de responsabilidades** - Cada arquivo tem um propósito
3. **Reutilização** - DRY (Don't Repeat Yourself)
4. **Tipagem** - TypeScript previne bugs
5. **Testabilidade** - Código desacoplado é fácil de testar

---

**Desenvolvido para UTFPR - Desenvolvimento Mobile 2026** 🚀
