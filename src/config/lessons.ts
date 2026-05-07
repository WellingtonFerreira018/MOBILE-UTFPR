import { Lesson } from "../components/lesson-selector";

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    number: 3,
    title: "Fundamentos do React",
    description: "JSX, Componentes Funcionais e Props",
  },
  {
    id: "lesson-2",
    number: 4,
    title: "Listagem de Dados",
    description: "FlatList e renderização de listas",
  },
  {
    id: "lesson-3",
    number: 4,
    title: "Integração com API",
    description: "Consumindo APIs REST com Axios",
  },
  {
    id: "lesson-4",
    number: 5,
    title: "Gerenciamento de Estado",
    description: "useState e Context API com tema dark/light",
  },
  {
    id: "lesson-5",
    number: 6,
    title: "Layout Mobile com Flexbox",
    description: "Componentes básicos e estruturação visual",
  },
  {
    id: "lesson-6",
    number: 8,
    title: "Persistência Local I",
    description: "AsyncStorage: setItem, getItem e JSON",
  },
  {
    id: "lesson-7",
    number: 9,
    title: "Persistência Local II",
    description: "SQLite: CRUD com banco de dados local",
  },
];
