# Maze

Sistema completo de gestão e controle de projetos desenvolvido com React, TypeScript e Tailwind CSS.

## 🎨 Características

- **Interface moderna** com cores branco e verde
- **Menu lateral** navegável
- **Dados mockados** para demonstração
- **Totalmente responsivo**

## 🚀 Funcionalidades

### ✅ 1. Cadastro e Estrutura de Projetos
- Criação de projetos
- Definição de cliente, equipe e responsáveis
- Datas de início e fim
- Status do projeto (Planejamento, Em execução, Concluído, etc.)

### ✅ 2. Gestão de Tarefas
- Criação de tarefas e subtarefas
- Responsáveis por tarefa
- Prazo de entrega
- Prioridade (Baixa, Média, Alta, Urgente)
- Status da tarefa
- Dependências entre tarefas

### ✅ 3. Cronograma / Linha do Tempo
- Visualização tipo Lista
- Visualização tipo Kanban
- Visualização tipo Gantt (linha do tempo)
- Datas e marcos do projeto

### ✅ 4. Gestão de Equipe
- Usuários e permissões
- Alocação de pessoas em tarefas
- Controle de carga de trabalho

### ✅ 5. Comunicação Interna
- Comentários em tarefas
- Anexos de arquivos
- Histórico de atividades
- Notificações de mudanças

### ✅ 6. Controle de Prazos e Progresso
- Percentual de conclusão do projeto
- Progresso por tarefa
- Alertas de atraso

### ✅ 7. Dashboard e Relatórios
- Projetos atrasados
- Tarefas por colaborador
- Projetos por status
- Horas gastas por projeto
- Rentabilidade

### ✅ 8. Permissões e Segurança
- Admin, Gerente, Colaborador, Cliente
- Controle de acesso por projeto

## 🛠️ Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navegação
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📂 Estrutura do Projeto

```
src/
├── components/
│   └── Layout.tsx          # Layout principal com menu lateral
├── pages/
│   ├── Dashboard.tsx       # Dashboard com estatísticas
│   ├── Projects.tsx        # Gestão de projetos
│   ├── Tasks.tsx          # Gestão de tarefas (Lista e Kanban)
│   ├── Timeline.tsx       # Cronograma (Gantt e Calendário)
│   ├── Team.tsx           # Gestão de equipe
│   ├── Reports.tsx        # Relatórios e análises
│   └── Settings.tsx       # Configurações do sistema
├── types.ts               # Definições de tipos TypeScript
├── mockData.ts            # Dados mockados para demonstração
├── App.tsx                # Componente principal
└── main.tsx              # Entry point
```

## 🎨 Cores do Projeto

- **Principal:** Verde (#22c55e)
- **Fundo:** Branco (#ffffff)
- **Texto:** Cinza escuro (#111827)
- **Bordas:** Cinza claro (#e5e7eb)

## 👥 Usuários Padrão (Mock)

- **Admin:** João Silva (joao@empresa.com)
- **Gerente:** Maria Santos (maria@empresa.com)
- **Colaborador:** Pedro Costa (pedro@empresa.com)
- **Colaborador:** Ana Oliveira (ana@empresa.com)
- **Cliente:** Carlos Mendes (carlos@cliente.com)

## 📊 Páginas do Sistema

1. **Dashboard** - Visão geral com estatísticas e atividades recentes
2. **Projetos** - Listagem e criação de projetos com filtros
3. **Tarefas** - Visualização em lista e kanban com detalhes
4. **Cronograma** - Gráfico de Gantt e calendário de marcos
5. **Equipe** - Gestão de membros e carga de trabalho
6. **Relatórios** - Análises detalhadas e métricas
7. **Configurações** - Perfil, segurança, notificações e permissões

## 🚀 Próximos Passos

Para evolução do sistema:
- [ ] Integração com backend (API REST)
- [ ] Autenticação JWT
- [ ] Upload real de arquivos
- [ ] WebSockets para notificações em tempo real
- [ ] Exportação de relatórios em PDF
- [ ] Modo escuro
- [ ] Internacionalização (i18n)
- [ ] Testes unitários e E2E

## 📝 Licença

Este projeto foi criado para fins educacionais e de demonstração.
