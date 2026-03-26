# 🎯 Aula: Gerenciamento de Estado no React Native

Esta aula demonstra os conceitos fundamentais de gerenciamento de estado usando **useState** e **Context API**.

---

## 📚 Temas Abordados

### 1. **useState - Estado Local**
Hook que permite adicionar estado a componentes funcionais.

### 2. **Context API - Estado Global**
Permite compartilhar estado entre múltiplos componentes sem prop drilling.

---

## 🎓 Conceitos Fundamentais

### **O que é Estado?**

Estado é qualquer dado que pode mudar ao longo do tempo e afetar o que é renderizado na tela.

**Exemplos:**
- Contador que incrementa/decrementa
- Tema claro/escuro
- Formulário com inputs
- Lista de itens

---

## 📌 Parte 1: useState

### **Sintaxe Básica**

```typescript
const [state, setState] = useState(initialValue);
```

**Componentes:**
- `state`: valor atual do estado
- `setState`: função para atualizar o estado
- `initialValue`: valor inicial

### **Exemplo Prático: Contador**

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+" onPress={increment} />
    </View>
  );
}
```

### **Boas Práticas com useState**

#### ✅ **Use função de atualização para valores baseados no anterior**

```typescript
// ✅ Correto
setCount(prevCount => prevCount + 1);

// ❌ Evite (pode causar bugs em atualizações rápidas)
setCount(count + 1);
```

#### ✅ **Nomeie estados de forma descritiva**

```typescript
// ✅ Bom
const [isLoading, setIsLoading] = useState(false);
const [userName, setUserName] = useState('');

// ❌ Ruim
const [flag, setFlag] = useState(false);
const [data, setData] = useState('');
```

#### ✅ **Separe estados relacionados**

```typescript
// ✅ Bom
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

// ❌ Ruim (se não precisam estar juntos)
const [user, setUser] = useState({ firstName: '', lastName: '' });
```

---

## 📌 Parte 2: Context API

### **O Problema: Prop Drilling**

Passar props por múltiplos níveis de componentes:

```typescript
// ❌ Prop Drilling
<App theme={theme}>
  <Header theme={theme}>
    <Navigation theme={theme}>
      <Button theme={theme} />
    </Navigation>
  </Header>
</App>
```

### **A Solução: Context API**

Compartilhar estado globalmente sem passar props:

```typescript
// ✅ Com Context
<ThemeProvider>
  <App>
    <Header>
      <Navigation>
        <Button /> {/* Acessa theme via useContext */}
      </Navigation>
    </Header>
  </App>
</ThemeProvider>
```

### **Implementação Completa**

#### **1. Criar o Context**

```typescript
import { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

#### **2. Criar o Provider**

```typescript
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### **3. Criar Hook Customizado**

```typescript
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  
  return context;
}
```

#### **4. Usar no App**

```typescript
// App.tsx
export default function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  );
}
```

#### **5. Consumir em Componentes**

```typescript
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme === 'light' ? '#fff' : '#000' }}>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
}
```

---

## 🎯 Quando Usar Cada Um?

### **Use useState quando:**
- ✅ Estado é local ao componente
- ✅ Não precisa ser compartilhado
- ✅ Dados simples (contador, toggle, input)

**Exemplos:**
- Estado de formulário
- Contador
- Modal aberto/fechado
- Accordion expandido/colapsado

### **Use Context quando:**
- ✅ Estado precisa ser global
- ✅ Múltiplos componentes precisam acessar
- ✅ Evitar prop drilling

**Exemplos:**
- Tema (dark/light)
- Autenticação (usuário logado)
- Idioma/internacionalização
- Configurações globais

---

## 📂 Estrutura dos Arquivos Criados

```
src/
├── components/
│   ├── counter.tsx           # Componente com useState
│   └── theme-toggle.tsx      # Componente que usa Context
├── context/
│   └── theme-context.tsx     # Context + Provider + Hook
└── screens/
    └── state-lesson-screen.tsx  # Tela da aula
```

---

## 🔍 Detalhes da Implementação

### **Counter Component**

**Características:**
- Usa `useState` para gerenciar contagem
- Props para customização (initialValue, step)
- Três ações: incrementar, decrementar, resetar
- UI responsiva e informativa

**Props:**
```typescript
type CounterProps = {
  initialValue?: number;  // Valor inicial (padrão: 0)
  step?: number;          // Incremento (padrão: 1)
};
```

**Estado:**
```typescript
const [count, setCount] = useState<number>(initialValue);
```

### **Theme Context**

**Características:**
- Gerencia tema global (light/dark)
- Define paleta de cores para cada tema
- Função para alternar tema
- Hook customizado para consumo

**Tipos:**
```typescript
type Theme = 'light' | 'dark';

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  secondary: string;
};
```

**Cores:**
- **Light**: Fundo branco, texto escuro
- **Dark**: Fundo escuro, texto claro

---

## 💡 Conceitos Avançados

### **1. Função de Atualização**

```typescript
// Forma funcional (recomendada)
setCount(prevCount => prevCount + 1);

// Por que? Garante que você está trabalhando com o valor mais recente
```

### **2. Lazy Initialization**

```typescript
// Se o cálculo inicial é custoso
const [state, setState] = useState(() => {
  const initialState = expensiveCalculation();
  return initialState;
});
```

### **3. Multiple Contexts**

```typescript
<ThemeProvider>
  <AuthProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </AuthProvider>
</ThemeProvider>
```

### **4. Context com Reducer**

Para estados complexos, combine Context com `useReducer`:

```typescript
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## 🎨 Demonstração Prática

### **Tela da Aula**

A tela `StateLessonScreen` demonstra:

1. **Dois contadores independentes**
   - Cada um com seu próprio estado
   - Valores iniciais e steps diferentes
   - Demonstra isolamento de estado

2. **Toggle de tema global**
   - Afeta toda a aplicação
   - Demonstra compartilhamento de estado
   - Mostra cores dinâmicas

3. **Exemplos de código**
   - Snippets explicativos
   - Conceitos-chave destacados

---

## 🚀 Como Testar

1. Execute o app:
```bash
npm start
```

2. Navegue para a aba **"🎯 Estado"**

3. Teste os contadores:
   - Clique em + e - para incrementar/decrementar
   - Observe que cada contador é independente
   - Use Reset para voltar ao valor inicial

4. Teste o tema:
   - Clique no botão de toggle
   - Observe que TODA a tela muda de cor
   - Navegue entre abas - o tema persiste

---

## 📊 Comparação: useState vs Context

| Aspecto | useState | Context API |
|---------|----------|-------------|
| **Escopo** | Local ao componente | Global (Provider) |
| **Compartilhamento** | Via props | Direto via hook |
| **Performance** | Melhor | Pode causar re-renders |
| **Complexidade** | Simples | Mais setup inicial |
| **Uso** | Estado local | Estado global |

---

## ✅ Exercícios Sugeridos

### **Nível Básico:**
1. Criar contador que só aceita números pares
2. Adicionar botão para multiplicar por 2
3. Criar toggle de tema com mais cores

### **Nível Intermediário:**
1. Criar Context para idioma (PT/EN)
2. Implementar histórico de contagem
3. Adicionar limite máximo/mínimo ao contador

### **Nível Avançado:**
1. Criar Context com múltiplos valores
2. Implementar undo/redo no contador
3. Persistir tema no AsyncStorage

---

## 🐛 Erros Comuns

### **1. Usar Context fora do Provider**

```typescript
// ❌ Erro
function App() {
  const { theme } = useTheme(); // Erro: fora do Provider
  return <ThemeProvider>...</ThemeProvider>;
}

// ✅ Correto
function AppContent() {
  const { theme } = useTheme(); // OK: dentro do Provider
  return <View>...</View>;
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
```

### **2. Não usar função de atualização**

```typescript
// ❌ Pode causar bugs
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1); // Não incrementa 2x!
};

// ✅ Correto
const handleClick = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // Incrementa 2x!
};
```

### **3. Mudar estado diretamente**

```typescript
// ❌ NUNCA faça isso
state.value = newValue;

// ✅ Sempre use setState
setState(newValue);
```

---

## 📚 Recursos Adicionais

- [React Hooks Documentation](https://react.dev/reference/react)
- [useState Hook](https://react.dev/reference/react/useState)
- [useContext Hook](https://react.dev/reference/react/useContext)
- [Context API Guide](https://react.dev/learn/passing-data-deeply-with-context)

---

## 🎯 Principais Aprendizados

1. **useState** gerencia estado local de componentes
2. **Context API** compartilha estado globalmente
3. Use função de atualização para estados baseados no anterior
4. Context evita prop drilling
5. Escolha a ferramenta certa para cada caso

---

**UTFPR - Desenvolvimento Mobile 2026** 🚀
